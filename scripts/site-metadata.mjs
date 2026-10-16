import {readFile} from 'node:fs/promises';
export const info=JSON.parse(await readFile(new URL('../src/site-info.json',import.meta.url),'utf8'));

export function makeSchema(route,description,image){
 const origin=info.origin,url=origin+route.path;
 const company={'@type':'Organization','@id':origin+'/#organization',name:info.name,url:origin+'/',description:'MAVE offers factory-built Pods and small-home material packages with construction drawings. Final quotations are prepared individually for each project.'};
 const website={'@type':'WebSite','@id':origin+'/#website',name:info.name,url:origin+'/',description:info.homeDescription,publisher:{'@id':company['@id']}};
 const p=info.products[route.id];
 const page={'@type':route.id==='about'?'AboutPage':route.id==='resources'?'CollectionPage':route.path.startsWith('/resources/')?'Article':'WebPage','@id':url+'#webpage',name:route.title,url,description,isPartOf:{'@id':website['@id']},publisher:{'@id':company['@id']}};
 if(image)page.image=origin+image;
 if(route.id==='about')page.mainEntity={'@id':company['@id']};
 const graph=[company,website,page];
 if(p){
  const price='$'+p.minimumPrice.toLocaleString('en-US');
  const qualifier=`${p.delivery}. Published starting price ${price} USD. Each project is quoted individually; this is not a fixed total installed project price.`;
  const product={'@type':'Product','@id':url+'#product',name:p.name,url,description:qualifier,category:p.format==='pod'?'Factory-built Pod':'Small-home material package and construction drawings',brand:{'@type':'Brand',name:info.name},mainEntityOfPage:{'@id':page['@id']},additionalProperty:[{'@type':'PropertyValue',name:'Floor area',value:p.areaSqFt,unitText:'square feet'},{'@type':'PropertyValue',name:'Delivery format',value:p.delivery}],offers:{'@type':'Offer',url,seller:{'@id':company['@id']},description:qualifier,priceCurrency:'USD',priceSpecification:{'@type':'PriceSpecification',minPrice:p.minimumPrice,priceCurrency:'USD',description:'Published starting price. Final scope and price require an individual project quotation.'}}};
  if(image)product.image=[origin+image];
  page.mainEntity={'@id':product['@id']};graph.push(product);
 }
 return {'@context':'https://schema.org','@graph':graph};
}

export function makeLlms(routes){
 const o=info.origin;
 const lowest=Object.values(info.products).reduce((a,b)=>a.minimumPrice<b.minimumPrice?a:b);
 const models=Object.entries(info.products).map(([id,p])=>`- [${p.name}](${o}/models/${id}): ${p.areaSqFt} sq ft. ${p.delivery}. Published starting price: USD ${p.minimumPrice.toLocaleString('en-US')}; final pricing requires an individual project quotation.`).join('\n');
 return `# MAVE

> MAVE is an architecture-led small-home brand offering factory-built Pods and material packages with construction drawings for small homes and cabins.

## Delivery and pricing

- Hearth Pod and Grove Pod are offered as complete factory-built Pod products, rather than loose material kits. Installation and site completion are separate project considerations.
- Hearth Studio, Grove Studio, and Hearth One Bedroom are offered as material packages with construction drawings; they are not delivered as completed, installed homes at their listed package prices.
- Published figures are starting prices in US dollars (USD), not fixed all-inclusive project totals. The lowest currently published model starting price is USD ${lowest.minimumPrice.toLocaleString('en-US')} for ${lowest.name}.
- MAVE prepares an individual quotation for each project. Confirm the selected product, configuration, delivery terms, installation, site work, utilities, taxes, and any other project-specific costs in that quotation.
- Refer to the model pages for current listed inclusions and exclusions. A written project quotation determines the agreed scope and final price.

## Products

${models}

## Brand and project inquiries

- [MAVE home](${o}/): Overview of models, process, and project inquiries.
- [About MAVE](${o}/about): Mission, approach, and founders.
- [Contact MAVE](${o}/#contact): Start a project inquiry or request a preliminary feasibility review through the contact options on the home page.

## Building guides

- [Resources](${o}/resources): Building guide index.
- [How much does a modular ADU cost?](${o}/resources/how-much-does-a-modular-adu-cost): Project budget categories and planning considerations. Project costs extend beyond a published model starting price.
- [Modular vs. traditional construction](${o}/resources/modular-vs-traditional-construction): Building methods, on-site work, and MAVE's delivery options.

## Technical references

- [Sitemap](${o}/sitemap.xml): Published page URLs.
- Product pages include Product JSON-LD with delivery format and a minimum-price specification. Minimum prices must not be interpreted as final installed quotes.
`;
}
