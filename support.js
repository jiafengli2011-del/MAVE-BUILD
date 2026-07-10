<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
<template id="__bundler_thumbnail" data-bg-color="#F3EFE6">
  <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="800" fill="#F3EFE6"/>
    <g transform="translate(600,400)">
      <path d="M-140 20 L0 -120 L140 20 L140 140 L-140 140 Z" fill="#2F4A38"/>
      <rect x="-30" y="60" width="60" height="80" fill="#F3EFE6"/>
    </g>
  </svg>
</template>
</head>
<body>
<x-dc>
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&amp;family=Schibsted+Grotesk:wght@400;500;600;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#F3EFE6;-webkit-font-smoothing:antialiased}
    ::selection{background:#2F4A38;color:#F3EFE6}
    image-slot{display:block!important;width:100%!important;height:100%!important}
    a{color:inherit}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  </style>
</helmet>
<div style="background:#F3EFE6;color:#20251F;font-family:'Schibsted Grotesk',system-ui,sans-serif">

  <!-- NAV -->
  <nav style="{{ navStyle }}">
    <a href="index.html" style="position:relative;display:block;width:102px;height:25px">
      <img src="uploads/mave-logo-beige.png" alt="MAVE" style="position:absolute;inset:0;width:102px;height:25px;display:block">
      <img src="uploads/mave-logo-brown.png" alt="" aria-hidden="true" style="position:absolute;inset:0;width:102px;height:25px;display:block;transition:opacity .35s ease;opacity:{{ logoBrownOpacity }}">
    </a>
    <div style="display:flex;align-items:center;gap:34px;font-size:14px;font-weight:500;color:{{ navText }};letter-spacing:.01em;transition:color .35s ease">
      <a href="index.html" style="text-decoration:none;color:inherit">Home</a>
      <div style="position:relative;display:flex;align-items:center" onMouseEnter="{{ aduEnter }}" onMouseLeave="{{ aduLeave }}">
        <a href="hearth-studio.html" style="display:inline-flex;align-items:center;gap:5px;text-decoration:none;color:inherit">ADU<span style="font-size:9px;opacity:.7">▾</span></a>
      </div>
      <a href="index.html#what-you-get" style="text-decoration:none;color:inherit">How It works</a>
      <a href="index.html#faq" style="text-decoration:none;color:inherit">FAQ</a>
      <a href="#" onClick="{{ openContact }}" style="text-decoration:none;color:inherit;cursor:pointer">Contact Us</a>
    </div>
    <a href="#" onClick="{{ openContact }}" style="{{ ctaStyle }}">Get a quote</a>
    <div style="{{ aduMenuStyle }}" onMouseEnter="{{ aduEnter }}" onMouseLeave="{{ aduLeave }}">
      <a href="hearth-studio.html" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px 56px;text-decoration:none" style-hover="opacity:.62">
        <span style="font-size:14px;font-weight:500;letter-spacing:.01em;color:#f3efe6;white-space:nowrap">Hearth · Studio</span>
        <span style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.04em;color:rgba(243,239,230,.6)">375 sq ft</span>
      </a>
      <div style="width:1px;background:rgba(243,239,230,.16);align-self:stretch"></div>
      <a href="grove-loft.html" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px 56px;text-decoration:none" style-hover="opacity:.62">
        <span style="font-size:14px;font-weight:500;letter-spacing:.01em;color:#f3efe6;white-space:nowrap">Grove · Studio</span>
        <span style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.04em;color:rgba(243,239,230,.6)">320 sq ft</span>
      </a>
      <div style="width:1px;background:rgba(243,239,230,.16);align-self:stretch"></div>
      <a href="hearth-one-bedroom.html" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px 56px;text-decoration:none" style-hover="opacity:.62">
        <span style="font-size:14px;font-weight:500;letter-spacing:.01em;color:#f3efe6;white-space:nowrap">Hearth · One Bedroom</span>
        <span style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.04em;color:rgba(243,239,230,.6)">480 sq ft</span>
      </a>
    </div>
  </nav>

  <!-- CONTACT OVERLAY -->
  <sc-if value="{{ contactOpen }}" hint-placeholder-val="{{ false }}">
    <div onClick="{{ closeContactBackdrop }}" style="position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(20,22,17,.58);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:fadeUp .25s ease both">
      <div onClick="{{ stopProp }}" style="position:relative;width:100%;max-width:600px;max-height:86vh;overflow-y:auto;background:#FBF9F4;border-radius:14px;box-shadow:0 46px 90px -24px rgba(0,0,0,.4);padding:46px 44px 42px">

        <sc-if value="{{ showBack }}" hint-placeholder-val="{{ false }}">
          <button onClick="{{ backToMenu }}" style="{{ backBtnStyle }}"><span style="font-size:15px">←</span> Back</button>
        </sc-if>
        <button onClick="{{ closeContact }}" style="position:absolute;top:22px;right:22px;width:32px;height:32px;border-radius:50%;border:none;background:transparent;color:#9A9486;font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1" style-hover="background:#E7E2D6;color:#20251F">×</button>

        <!-- MENU -->
        <sc-if value="{{ isMenu }}" hint-placeholder-val="{{ true }}">
          <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:14px">— Contact us</div>
          <h2 style="font-family:'Spectral',serif;font-size:32px;line-height:1.1;letter-spacing:-.01em;font-weight:500;margin-bottom:12px">Let's talk about your project.</h2>
          <p style="font-size:15.5px;line-height:1.6;color:#54594D;margin-bottom:32px;max-width:44ch">Whichever way you'd rather reach us — we'll get back to you within one business day.</p>
          <div style="display:flex;flex-direction:column;gap:14px">
            <button onClick="{{ goFeasibility }}" style="display:flex;align-items:flex-start;gap:16px;text-align:left;padding:20px 22px;border-radius:10px;border:1px solid #DCD6C8;background:#FFFFFF;cursor:pointer;transition:border-color .2s ease, background .2s ease" style-hover="border-color:#2F4A38;background:#EFF3EC">
              <span style="flex-shrink:0;width:40px;height:40px;border-radius:50%;background:#E4EBE1;display:flex;align-items:center;justify-content:center;color:#2F4A38"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v3H9z"></path><path d="M6 6h12v15H6z"></path><path d="M9 12h6M9 16h6"></path></svg></span>
              <span style="display:flex;flex-direction:column;gap:4px">
                <span style="font-size:16px;font-weight:600;color:#20251F">Get a free feasibility study</span>
                <span style="font-size:13.5px;line-height:1.5;color:#7C7868">Tell us about your site and goals — we'll confirm what's possible, free and with no obligation.</span>
              </span>
              <span style="margin-left:auto;flex-shrink:0;color:#9A9486;font-size:18px;align-self:center">→</span>
            </button>
            <button onClick="{{ goMessage }}" style="display:flex;align-items:flex-start;gap:16px;text-align:left;padding:20px 22px;border-radius:10px;border:1px solid #DCD6C8;background:#FFFFFF;cursor:pointer;transition:border-color .2s ease, background .2s ease" style-hover="border-color:#2F4A38;background:#EFF3EC">
              <span style="flex-shrink:0;width:40px;height:40px;border-radius:50%;background:#E4EBE1;display:flex;align-items:center;justify-content:center;color:#2F4A38"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"></path><path d="M4 7l8 6 8-6"></path></svg></span>
              <span style="display:flex;flex-direction:column;gap:4px">
                <span style="font-size:16px;font-weight:600;color:#20251F">Send us a message</span>
                <span style="font-size:13.5px;line-height:1.5;color:#7C7868">Have a quick question? Reach our team directly by email.</span>
              </span>
              <span style="margin-left:auto;flex-shrink:0;color:#9A9486;font-size:18px;align-self:center">→</span>
            </button>
          </div>
        </sc-if>

        <!-- FEASIBILITY STUDY FORM -->
        <sc-if value="{{ isFeasibility }}" hint-placeholder-val="{{ false }}">
          <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:14px">— Free feasibility study</div>
          <h2 style="font-family:'Spectral',serif;font-size:28px;line-height:1.14;letter-spacing:-.01em;font-weight:500;margin-bottom:10px">Let's see what's possible on your site.</h2>
          <p style="font-size:15px;line-height:1.6;color:#54594D;margin-bottom:30px;max-width:48ch">A few quick questions about your property and goals — our team will confirm feasibility and follow up within one business day.</p>
          <form action="https://formspree.io/f/xnjkealb" method="POST" onSubmit="{{ submitFeasibility }}" style="display:flex;flex-direction:column;gap:26px">
            <input type="hidden" name="form_type" value="Feasibility study request">
            <input type="hidden" name="_subject" value="New feasibility study request – MAVE website">
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:12px">Contact info</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
                <input type="text" name="first_name" placeholder="First name" style="{{ inputStyle }}">
                <input type="text" name="last_name" placeholder="Last name" style="{{ inputStyle }}">
              </div>
              <input type="email" name="email" placeholder="Email" style="{{ inputStyleFull }}">
              <input type="tel" name="phone" placeholder="Phone" style="{{ inputStyleFull }}">
            </div>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:12px">Your property</div>
              <input type="text" name="address" placeholder="Installation address" style="{{ inputStyleFull }}">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <input type="text" name="zip" placeholder="ZIP code" style="{{ inputStyle }}">
                <input type="text" name="city" placeholder="City, state" style="{{ inputStyle }}">
              </div>
            </div>
            <div>
              <div style="font-size:14px;font-weight:600;color:#20251F;margin-bottom:10px">Do you currently own the property?</div>
              <input type="hidden" name="owns_property" value="{{ feasOwn }}">
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                <sc-for list="{{ feasOwnOptions }}" as="opt" hint-placeholder-count="3">
                  <button type="button" onClick="{{ opt.onClick }}" style="{{ opt.style }}">{{ opt.label }}</button>
                </sc-for>
              </div>
            </div>
            <div>
              <div style="font-size:14px;font-weight:600;color:#20251F;margin-bottom:10px">Property type</div>
              <input type="hidden" name="property_type" value="{{ feasPropType }}">
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                <sc-for list="{{ feasPropTypeOptions }}" as="opt" hint-placeholder-count="3">
                  <button type="button" onClick="{{ opt.onClick }}" style="{{ opt.style }}">{{ opt.label }}</button>
                </sc-for>
              </div>
            </div>
            <div>
              <div style="font-size:14px;font-weight:600;color:#20251F;margin-bottom:10px">Which unit interests you?</div>
              <input type="hidden" name="unit_interested" value="{{ feasUnit }}">
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                <sc-for list="{{ feasUnitOptions }}" as="opt" hint-placeholder-count="4">
                  <button type="button" onClick="{{ opt.onClick }}" style="{{ opt.style }}">{{ opt.label }}</button>
                </sc-for>
              </div>
            </div>
            <div>
              <div style="font-size:14px;font-weight:600;color:#20251F;margin-bottom:10px">Timeline</div>
              <input type="hidden" name="timeline" value="{{ feasTimeline }}">
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                <sc-for list="{{ feasTimelineOptions }}" as="opt" hint-placeholder-count="4">
                  <button type="button" onClick="{{ opt.onClick }}" style="{{ opt.style }}">{{ opt.label }}</button>
                </sc-for>
              </div>
            </div>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:12px">Anything else we should know? <span style="text-transform:none;letter-spacing:0;color:#B3AC9C">(optional)</span></div>
              <textarea name="notes" placeholder="Site details, questions, or context that would help our review" rows="3" style="{{ textareaStyle }}"></textarea>
            </div>
            <sc-if value="{{ feasError }}" hint-placeholder-val="{{ false }}">
              <div style="font-size:13.5px;color:#9A5A3C">Something went wrong sending your request. Please try again, or reach us directly.</div>
            </sc-if>
            <button type="submit" disabled="{{ feasSubmitting }}" style="{{ submitStyle }}">{{ feasSubmitLabel }}</button>
          </form>
        </sc-if>

        <!-- MESSAGE FORM -->
        <sc-if value="{{ isMessage }}" hint-placeholder-val="{{ false }}">
          <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:14px">— Send a message</div>
          <h2 style="font-family:'Spectral',serif;font-size:28px;line-height:1.14;letter-spacing:-.01em;font-weight:500;margin-bottom:10px">Send us a message.</h2>
          <p style="font-size:15px;line-height:1.6;color:#54594D;margin-bottom:30px;max-width:48ch">Have a question about Hearth Studio, Grove Studio, or Hearth 1B1B? Use this form and a MAVE specialist will get back to you within one business day.</p>
          <form action="https://formspree.io/f/xnjkealb" method="POST" onSubmit="{{ submitMessage }}" style="display:flex;flex-direction:column;gap:26px">
            <input type="hidden" name="form_type" value="Website message">
            <input type="hidden" name="_subject" value="New website message – MAVE website">
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:12px">Contact info</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
                <input type="text" name="first_name" placeholder="First name" style="{{ inputStyle }}">
                <input type="text" name="last_name" placeholder="Last name" style="{{ inputStyle }}">
              </div>
              <input type="email" name="email" placeholder="Email" style="{{ inputStyleFull }}">
              <input type="tel" name="phone" placeholder="Phone" style="{{ inputStyleFull }}">
            </div>
            <div>
              <div style="font-size:14px;font-weight:600;color:#20251F;margin-bottom:10px">What's this about?</div>
              <input type="hidden" name="product" value="{{ msgProduct }}">
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                <sc-for list="{{ msgProductOptions }}" as="opt" hint-placeholder-count="4">
                  <button type="button" onClick="{{ opt.onClick }}" style="{{ opt.style }}">{{ opt.label }}</button>
                </sc-for>
              </div>
            </div>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:12px">Your message</div>
              <textarea name="message" placeholder="How can we help?" rows="5" style="{{ textareaStyle }}"></textarea>
            </div>
            <sc-if value="{{ msgError }}" hint-placeholder-val="{{ false }}">
              <div style="font-size:13.5px;color:#9A5A3C">Something went wrong sending your message. Please try again, or reach us directly.</div>
            </sc-if>
            <button type="submit" disabled="{{ msgSubmitting }}" style="{{ submitStyle }}">{{ msgSubmitLabel }}</button>
          </form>
        </sc-if>

        <!-- DONE -->
        <sc-if value="{{ isDone }}" hint-placeholder-val="{{ false }}">
          <div style="display:flex;flex-direction:column;align-items:flex-start;padding:20px 0 8px">
            <span style="width:48px;height:48px;border-radius:50%;background:#E4EBE1;display:flex;align-items:center;justify-content:center;color:#2F4A38;margin-bottom:22px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span>
            <h2 style="font-family:'Spectral',serif;font-size:28px;line-height:1.14;letter-spacing:-.01em;font-weight:500;margin-bottom:12px">Thanks for reaching out.</h2>
            <p style="font-size:15px;line-height:1.6;color:#54594D;margin-bottom:28px;max-width:46ch">We've received your message and will get back to you as soon as possible.</p>
            <button onClick="{{ closeContact }}" style="{{ submitStyle }}max-width:220px">Close</button>
          </div>
        </sc-if>

      </div>
    </div>
  </sc-if>

  <!-- BREADCRUMB + TITLE -->
  <section style="max-width:1280px;margin:0 auto;padding:40px 44px 0">
    <a href="index.html#plans" style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.04em;color:#54594D;text-decoration:none">← All floor plans</a>
    <div style="margin-top:24px">
      <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:16px">Series 01 · Studio · ADU</div>
      <h1 style="font-family:'Spectral',serif;font-size:60px;line-height:1.0;letter-spacing:-.02em;font-weight:500">Hearth · Studio</h1>
    </div>
  </section>

  <!-- HERO RENDER (full-bleed) -->
  <section style="width:100%;margin-top:32px">
    <img src="assets/hero-render-dark.png" alt="" style="width:100%;height:640px;border-top:1px solid #E2DDD0;border-bottom:1px solid #E2DDD0;object-fit:cover;display:block">
  </section>

  <!-- OVERVIEW + EXTERIOR (image bleeds right) -->
  <section style="width:100%;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:64px 0 24px">
    <div style="padding-left:max(44px,calc((100vw - 1280px)/2 + 44px));padding-right:52px;max-width:760px">
      <div style="margin-bottom:32px;padding-bottom:28px;border-bottom:1px solid #E2DDD0">
        <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#9A9486;margin-bottom:10px">Starting at</div>
        <div style="font-family: Times New Roman; font-size: 50px; font-weight: 500; letter-spacing: -.02em; color: #20251F; line-height: .95; margin-bottom: 10px">$65,000</div>
        <div style="font-size:13.5px;color:#7C7868">Construction Package + Shipping Included</div>
      </div>
      <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:18px">— Overview</div>
      <h2 style="font-family:'Spectral',serif;font-size:34px;line-height:1.12;letter-spacing:-.01em;font-weight:500;margin-bottom:22px;max-width:480px">A complete home, in its most essential form.</h2>
      <p style="font-size:17px;line-height:1.6;color:#54594D;max-width:520px;margin-bottom:18px">The Hearth Studio fits everything you need — kitchen, bath, living and sleeping — into a single refined footprint designed for backyard living. No compromise on quality; just a smarter use of space.</p>
      <p style="font-size:17px;line-height:1.6;color:#54594D;max-width:520px">Whether you're housing a family member, hosting a long-term guest, or generating rental income, this is the ADU that works as hard as you do.</p>
      <div style="border-top:1px solid #E2DDD0;padding-top:26px;margin-top:32px">
        <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:14px">Keywords</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <span style="font-size:12.5px;color:#4A4F44;background:#FBF9F4;border:1px solid #E2DDD0;border-radius:100px;padding:6px 13px">Backyard ADU</span>
          <span style="font-size:12.5px;color:#4A4F44;background:#FBF9F4;border:1px solid #E2DDD0;border-radius:100px;padding:6px 13px">Compact living</span>
          <span style="font-size:12.5px;color:#4A4F44;background:#FBF9F4;border:1px solid #E2DDD0;border-radius:100px;padding:6px 13px">All-in-one layout</span>
          <span style="font-size:12.5px;color:#4A4F44;background:#FBF9F4;border:1px solid #E2DDD0;border-radius:100px;padding:6px 13px">Rental-ready</span>
          <span style="font-size:12.5px;color:#4A4F44;background:#FBF9F4;border:1px solid #E2DDD0;border-radius:100px;padding:6px 13px">Efficient footprint</span>
          <span style="font-size:12.5px;color:#4A4F44;background:#FBF9F4;border:1px solid #E2DDD0;border-radius:100px;padding:6px 13px">Independent living</span>
        </div>
      </div>
    </div>
    <div style="overflow: hidden; height: 640px; width: 685px">
      <img src="https://i.ibb.co/ZpKJpHzH/Studio-Living-room.jpg" alt="" style="width: 100%; height: 527px; object-fit:cover; display:block">
    </div>
  </section>

  <!-- EXTERIOR + SPECS (image bleeds left) -->
  <section style="width:100%;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:24px 0 72px">
    <div style="overflow: hidden; height: 503px; width: 707px">
      <img src="assets/studio-exterior-view-3.png" alt="" style="width: 757px; height: 503px; object-fit:cover; display:block">
    </div>
    <div style="background:#FBF9F4;border:1px solid #E2DDD0;border-radius:16px;padding:30px;align-self:center;margin-left:52px;margin-right:max(44px,calc((100vw - 1280px)/2 + 44px))">
      <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9486;margin-bottom:20px">Specifications</div>
      <div style="display:flex;flex-direction:column">
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #E2DDD0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="8.5" width="19" height="7" rx="1.2"></rect><path d="M7 8.5v2.5M11 8.5v3M15 8.5v2.5M19 8.5v2"></path></svg></span>
          <span style="flex:1;color:#54594D">Floor area</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">375 sq ft</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #E2DDD0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="2.8"></circle><path d="M3.6 19c0-2.9 2.4-4.8 5.4-4.8s5.4 1.9 5.4 4.8"></path><path d="M16 5.6a2.8 2.8 0 010 5.2"></path><path d="M17.4 19c0-2.4-1.1-3.9-2.9-4.5"></path></svg></span>
          <span style="flex:1;color:#54594D">Sleeps</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">1–2</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #E2DDD0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V6.5"></path><path d="M3 12h15a3 3 0 013 3v3"></path><path d="M3 18h18"></path><path d="M3 15h18"></path><rect x="6" y="8.6" width="4.4" height="3.4" rx="1.1"></rect></svg></span>
          <span style="flex:1;color:#54594D">Bedrooms</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">Studio</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #E2DDD0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5h16"></path><path d="M5 12.5v2.5a3.5 3.5 0 003.5 3.5h7A3.5 3.5 0 0019 15v-2.5"></path><path d="M7 12.5V7.2A2.1 2.1 0 019.1 5.1a2.1 2.1 0 012 1.5"></path><path d="M7.3 21l.7-1.2M16.7 21l-.7-1.2"></path></svg></span>
          <span style="flex:1;color:#54594D">Bathrooms</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">1</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #E2DDD0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="1.4"></rect><path d="M3.5 10h17M10 10v10.5"></path></svg></span>
          <span style="flex:1;color:#54594D">Footprint</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">12'-2" × 31'-0"</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #E2DDD0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v17"></path><path d="M8.5 7 12 3.5 15.5 7"></path><path d="M8.5 17 12 20.5 15.5 17"></path><path d="M5 3.5h14M5 20.5h14"></path></svg></span>
          <span style="flex:1;color:#54594D">Height</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">12.5 ft</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:13px 0">
          <span style="flex-shrink:0;display:inline-flex;color:#2F4A38"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 3.5H7A1.5 1.5 0 005.5 5v14A1.5 1.5 0 007 20.5h10a1.5 1.5 0 001.5-1.5V8.5z"></path><path d="M13.5 3.5V8.5h5"></path><path d="M8.6 14l2.2 2.2 4.4-4.4"></path></svg></span>
          <span style="flex:1;color:#54594D">Permit set</span><span style="font-weight:600;font-family:'Space Mono',monospace;font-size:14px;color:#20251F">Included</span>
        </div>
      </div>
      <a href="#" onClick="{{ openContact }}" style="display:block;text-align:center;margin-top:24px;font-size:15px;font-weight:600;color:#F3EFE6;background:#2F4A38;padding:14px;border-radius:8px;text-decoration:none">Get a quote</a>
    </div>
  </section>

  <!-- FLOOR PLAN -->
  <section style="border-top:1px solid #E2DDD0;background:#EDE8DB">
    <div style="max-width:1280px;margin:0 auto;padding:72px 44px">
      <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:18px">— Floor plan</div>
      <h2 style="font-family:'Spectral',serif;font-size:34px;line-height:1.1;letter-spacing:-.01em;font-weight:500;margin-bottom:36px">The layout</h2>
      <img src="https://i.ibb.co/MjKGzwy/Untitled-1.jpg" alt="" style="width:100%;height:520px;border:1px solid #E2DDD0;background:#FBF9F4;border-radius:16px;object-fit:contain;display:block">
    </div>
  </section>

  <!-- PACKAGE CONTENTS -->
  <section style="border-top:1px solid #E2DDD0;background:#F3EFE6">
    <div style="max-width:1280px;margin:0 auto;padding:80px 44px">
      <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:18px">— What's included</div>
      <h2 style="font-family:'Spectral',serif;font-size:38px;line-height:1.08;letter-spacing:-.02em;font-weight:500;margin-bottom:14px">In the package</h2>
      <p style="font-size:16.5px;line-height:1.6;color:#54594D;max-width:560px;margin-bottom:52px">Every Hearth Studio ships as a complete, build-ready kit — here's exactly what's in the box, and what your local contractor sources and handles on site.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:36px">

        <!-- Included -->
        <div>
          <span style="display:inline-flex;align-items:center;gap:7px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.04em;color:#2F4A38;background:#E4EBE1;border:1px solid #CBD8C6;border-radius:100px;padding:6px 14px;margin-bottom:6px;white-space:nowrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"></path></svg>Included</span>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Design &amp; engineering</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Design &amp; engineering, including 1 free design revision cycle · stamped permit-ready drawing sets</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Build support</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Full-build construction consulting · general contractor training</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Shipping</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Construction kit shipping — NY, NJ, OR, CA, WA</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Structure</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">SIPs structural panel kit — exterior enclosure · steel + insulation panels — interior framing</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8;border-bottom:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Windows and weatherproofing</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Windows &amp; exterior doors · weatherproofing and functional membranes</p>
          </div>
        </div>

        <!-- Optional -->
        <div>
          <span style="display:inline-flex;align-items:center;gap:7px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.04em;color:#8A6A2F;background:#F1E9D6;border:1px solid #E3D3A8;border-radius:100px;padding:6px 14px;margin-bottom:6px;white-space:nowrap"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 8v4.5l3 2"></path></svg>Optional</span>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Permitting</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Permitting submission on your behalf</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Roofing and siding</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Standing seam metal roof system · exterior siding system — various colors</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Interior finishes</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Interior wall finish panels — gypsum board / marine plywood · interior flooring — vinyl / engineered · interior door &amp; trim</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8;border-bottom:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:10px">Casework</h3>
            <div style="display:flex;flex-direction:column;gap:8px">
              <span style="font-size:15px;line-height:1.5;color:#54594D">Kitchen casework — various finishes</span>
              <span style="font-size:15px;line-height:1.5;color:#54594D">Storage casework — various finishes</span>
              <span style="font-size:15px;line-height:1.5;color:#54594D">Bathroom casework — various finishes</span>
            </div>
          </div>
        </div>

        <!-- Offered -->
        <div>
          <span style="display:inline-flex;align-items:center;gap:7px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.04em;color:#34547A;background:#E1E8F0;border:1px solid #C6D3E3;border-radius:100px;padding:6px 14px;margin-bottom:6px;white-space:nowrap"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.7 4.9 5 .4-3.8 3.3 1.2 4.9-4.1-2.6-4.1 2.6 1.2-4.9-3.8-3.3 5-.4z"></path></svg>Offered</span>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8;border-bottom:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Construction network</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">We maintain a network of trusted local contractors, architects, and engineers who are familiar with our building system.</p>
          </div>
        </div>

        <!-- Not included -->
        <div>
          <span style="display:inline-flex;align-items:center;gap:7px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.04em;color:#9A5A3C;background:#F1E5DC;border:1px solid #E3CBBB;border-radius:100px;padding:6px 14px;margin-bottom:6px;white-space:nowrap"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>Not included</span>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Construction and site</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Foundation and site work · on-site construction · utilities hookups</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">MEP systems</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Electrical system · plumbing system · HVAC system</p>
          </div>
          <div style="padding:22px 0 18px;border-top:1px solid #DCD6C8;border-bottom:1px solid #DCD6C8">
            <h3 style="font-size:16.5px;font-weight:600;color:#20251F;margin-bottom:8px">Interior installation</h3>
            <p style="font-size:15px;line-height:1.6;color:#54594D">Interior finish/casework installation · lighting fixtures</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- PERFORMANCE -->
  <section style="border-top:1px solid #E2DDD0;background:#EDE8DB">
    <div style="max-width:1280px;margin:0 auto;padding:72px 44px">
      <div style="font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#B16A45;margin-bottom:18px">— Performance</div>
      <h2 style="font-family:'Spectral',serif;font-size:34px;line-height:1.1;letter-spacing:-.01em;font-weight:500;margin-bottom:40px">Built to outperform from day one.</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div style="background:#FBF9F4;border:1px solid #E2DDD0;border-radius:16px;padding:32px">
          <div style="font-family:'Spectral',serif;font-size:46px;font-weight:500;letter-spacing:-.02em;color:#2F4A38;line-height:1;margin-bottom:14px">~50%</div>
          <h3 style="font-size:17px;font-weight:600;color:#20251F;margin-bottom:8px">Faster shell assembly vs. stick frame</h3>
          <p style="font-size:13.5px;line-height:1.55;color:#7C7868;font-style:italic">SIPs industry standard — assembly in days, not weeks.</p>
        </div>
        <div style="background:#FBF9F4;border:1px solid #E2DDD0;border-radius:16px;padding:32px">
          <div style="font-family:'Spectral',serif;font-size:46px;font-weight:500;letter-spacing:-.02em;color:#2F4A38;line-height:1;margin-bottom:14px">~40–60%</div>
          <h3 style="font-size:17px;font-weight:600;color:#20251F;margin-bottom:8px">Better thermal performance</h3>
          <p style="font-size:13.5px;line-height:1.55;color:#7C7868;font-style:italic">vs. standard 2×6 stud wall — continuous insulation, no thermal bridging.</p>
        </div>
        <div style="background:#FBF9F4;border:1px solid #E2DDD0;border-radius:16px;padding:32px">
          <div style="font-family:'Spectral',serif;font-size:46px;font-weight:500;letter-spacing:-.02em;color:#2F4A38;line-height:1;margin-bottom:14px">7 day</div>
          <h3 style="font-size:17px;font-weight:600;color:#20251F;margin-bottom:8px">To stand the structural shell</h3>
          <p style="font-size:13.5px;line-height:1.55;color:#7C7868;font-style:italic">For a compact footprint with an experienced crew.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- NEXT PLAN / CTA -->
  <section style="max-width:1280px;margin:0 auto;padding:40px 44px 96px">
    <div style="background:#2F4A38;border-radius:22px;padding:64px 56px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px">
      <div>
        <h2 style="font-family:'Spectral',serif;font-size:38px;line-height:1.05;letter-spacing:-.02em;font-weight:500;color:#F3EFE6;max-width:480px;margin-bottom:12px">Make the Hearth Studio yours.</h2>
        <p style="font-size:16.5px;line-height:1.55;color:#C2CBBE;max-width:420px">Book a free consult to price your build and adapt the plan to your lot.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a href="#" onClick="{{ openContact }}" style="font-size:16px;font-weight:600;color:#2F4A38;background:#F3EFE6;padding:15px 26px;border-radius:8px;text-decoration:none">Book a free consult</a>
        <a href="grove-loft.html" style="font-size:16px;font-weight:600;color:#F3EFE6;background:transparent;border:1px solid #5B7263;padding:15px 26px;border-radius:8px;text-decoration:none">Next: Grove Studio →</a>
      </div>
    </div>
  </section>

</div>
</x-dc>
<script type="text/x-dc" data-dc-script>
class Component extends DCLogic {
  state = { aduOpen: false, scrolled: false, contactOpen: false, contactStep: 'menu', feasOwn: '', feasPropType: '', feasUnit: '', feasTimeline: '', msgProduct: '' };
  _submitToFormspree(form) {
    return fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
  }
  componentDidMount() {
    this._onScroll = () => { const s = window.scrollY > 30; if (s !== this.state.scrolled) this.setState({ scrolled: s }); };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  }
  componentWillUnmount() { window.removeEventListener('scroll', this._onScroll); }
  renderVals() {
    const scrolled = this.state.scrolled;
    const navStyle = "position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:17px 40px;transition:background-color .35s ease, backdrop-filter .35s ease, border-color .35s ease;border-bottom:1px solid " + (scrolled ? "rgba(59,54,48,.14)" : "#2f4836eb") + ";" + (scrolled ? "background-color:rgba(243,239,230,.72);backdrop-filter:blur(14px) saturate(1.08);-webkit-backdrop-filter:blur(14px) saturate(1.08);" : "background-color:#3B3630;backdrop-filter:none;-webkit-backdrop-filter:none;");
    const navText = scrolled ? '#3B3630' : '#f3efe6';
    const logoBrownOpacity = scrolled ? 1 : 0;
    const ctaStyle = "font-size:14px;font-weight:600;padding:10px 18px;border-radius:6px;text-decoration:none;transition:background-color .35s ease, color .35s ease;" + (scrolled ? "background-color:#3B3630;color:#f3efe6;" : "background-color:#f3efe6;color:#3b5444;");
    const menuBase = "position:absolute;top:100%;left:0;right:0;width:100%;background:#3B3630;padding:42px 40px 46px;display:flex;justify-content:center;align-items:stretch;gap:0;z-index:59;box-shadow:0 26px 40px -22px rgba(0,0,0,.45);transition:opacity .22s ease, transform .22s ease;";
    const aduMenuStyle = this.state.aduOpen
      ? menuBase + "opacity:1;visibility:visible;transform:translateY(0);"
      : menuBase + "opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-12px);";
    const buildOptions = (options, selected, setter) => options.map(label => ({
      label,
      style: "padding:9px 15px;border-radius:100px;border:1px solid " + (selected === label ? "#2F4A38" : "#D8D3C6") + ";background:" + (selected === label ? "#2F4A38" : "#FFFFFF") + ";color:" + (selected === label ? "#F3EFE6" : "#54594D") + ";font-size:13.5px;font-family:'Schibsted Grotesk',system-ui,sans-serif;cursor:pointer;white-space:nowrap;transition:background .15s ease, color .15s ease, border-color .15s ease",
      onClick: () => setter(label)
    }));
    const feasOwnOptions = buildOptions(['Yes', 'Not yet', 'Renting'], this.state.feasOwn, v => this.setState({ feasOwn: v }));
    const feasPropTypeOptions = buildOptions(['Single-family lot', 'Multi-family', 'Land only'], this.state.feasPropType, v => this.setState({ feasPropType: v }));
    const feasUnitOptions = buildOptions(['Hearth Studio', 'Grove Studio', 'Hearth 1B1B', 'Not sure yet'], this.state.feasUnit, v => this.setState({ feasUnit: v }));
    const feasTimelineOptions = buildOptions(['ASAP', '3–6 months', '6–12 months', 'Just exploring'], this.state.feasTimeline, v => this.setState({ feasTimeline: v }));
    const msgProductOptions = buildOptions(['Hearth Studio', 'Grove Studio', 'Hearth 1B1B', 'General question'], this.state.msgProduct, v => this.setState({ msgProduct: v }));
    const inputStyle = "width:100%;padding:13px 14px;border-radius:8px;border:1px solid #D8D3C6;background:#FFFFFF;color:#20251F;font-size:14.5px;font-family:'Schibsted Grotesk',system-ui,sans-serif;outline:none";
    const inputStyleFull = inputStyle + ";margin-bottom:10px";
    const textareaStyle = inputStyle + ";resize:vertical;font-family:'Schibsted Grotesk',system-ui,sans-serif";
    const submitStyle = "margin-top:4px;width:100%;padding:15px 20px;border-radius:8px;border:none;background:#2F4A38;color:#F3EFE6;font-size:15px;font-weight:600;cursor:pointer;transition:background .2s ease";
    const backBtnStyle = "position:absolute;top:22px;left:44px;display:inline-flex;align-items:center;gap:6px;border:none;background:transparent;color:#9A9486;font-size:14px;font-weight:500;cursor:pointer;padding:4px 2px";
    const contactStep = this.state.contactStep;
    const isMenu = contactStep === 'menu';
    const isFeasibility = contactStep === 'feasibility';
    const isMessage = contactStep === 'message';
    const isDone = contactStep === 'done-feasibility' || contactStep === 'done-message';
    const showBack = isFeasibility || isMessage;
    const feasSubmitting = !!this.state.feasSubmitting;
    const msgSubmitting = !!this.state.msgSubmitting;
    const feasError = !!this.state.feasError;
    const msgError = !!this.state.msgError;
    const feasSubmitLabel = feasSubmitting ? 'Sending…' : 'Request my free feasibility study';
    const msgSubmitLabel = msgSubmitting ? 'Sending…' : 'Send message';
    const openContact = (e) => { if (e) e.preventDefault(); this.setState({ contactOpen: true, contactStep: 'menu' }); };
    const closeContact = () => this.setState({ contactOpen: false });
    const closeContactBackdrop = (e) => { if (e.target === e.currentTarget) this.setState({ contactOpen: false }); };
    const stopProp = (e) => e.stopPropagation();
    const goFeasibility = () => this.setState({ contactStep: 'feasibility' });
    const goMessage = () => this.setState({ contactStep: 'message' });
    const backToMenu = () => this.setState({ contactStep: 'menu' });
    const submitFeasibility = (e) => {
      e.preventDefault();
      const form = e.target;
      this.setState({ feasSubmitting: true, feasError: false });
      this._submitToFormspree(form).then(res => {
        if (res.ok) this.setState({ contactStep: 'done-feasibility', feasSubmitting: false });
        else this.setState({ feasSubmitting: false, feasError: true });
      }).catch(() => this.setState({ feasSubmitting: false, feasError: true }));
    };
    const submitMessage = (e) => {
      e.preventDefault();
      const form = e.target;
      this.setState({ msgSubmitting: true, msgError: false });
      this._submitToFormspree(form).then(res => {
        if (res.ok) this.setState({ contactStep: 'done-message', msgSubmitting: false });
        else this.setState({ msgSubmitting: false, msgError: true });
      }).catch(() => this.setState({ msgSubmitting: false, msgError: true }));
    };
    return {
      navStyle, navText, logoBrownOpacity, ctaStyle,
      aduMenuStyle,
      aduEnter: () => { clearTimeout(this._aduT); this.setState({ aduOpen: true }); },
      aduLeave: () => { clearTimeout(this._aduT); this._aduT = setTimeout(() => this.setState({ aduOpen: false }), 160); },
      contactOpen: this.state.contactOpen,
      contactStep,
      isMenu,
      isFeasibility,
      isMessage,
      isDone,
      showBack,
      feasSubmitting,
      msgSubmitting,
      feasError,
      msgError,
      feasSubmitLabel,
      msgSubmitLabel,
      openContact,
      closeContact,
      closeContactBackdrop,
      stopProp,
      goFeasibility,
      goMessage,
      backToMenu,
      submitFeasibility,
      submitMessage,
      feasOwnOptions,
      feasPropTypeOptions,
      feasUnitOptions,
      feasTimelineOptions,
      msgProductOptions,
      inputStyle,
      inputStyleFull,
      textareaStyle,
      submitStyle,
      backBtnStyle
    };
  }
}
</script>
</body>
</html>
