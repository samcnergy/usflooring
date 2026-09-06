"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Planning and budgeting",
  "Hiring and contracts",
  "Kitchen remodeling",
  "Bathroom remodeling",
  "Flooring, tile, and countertops",
  "Permits and California rules",
  "Construction and aftercare",
  "Design trends",
];

const FAQS = [
  // Planning and Budgeting
  {
    cat: "Planning and budgeting",
    q: "How do I know whether to remodel or move?",
    a: "The first thing I ask is whether you actually like your neighborhood. If the street works for you and the house has solid bones, remodeling almost always makes more financial sense than absorbing realtor fees, transfer taxes, and the uncertainty of what you are walking into with another property. But if the fundamental problem is the location, no remodel fixes that. Start with an honest assessment of what you are trying to solve before spending anything.",
  },
  {
    cat: "Planning and budgeting",
    q: "What should I decide before contacting a remodeling company?",
    a: "You do not need finished plans. What helps is knowing which rooms are involved, what specifically is not working for you, a rough sense of what you are willing to spend, and who in your household is making decisions. Pull together some photos of spaces you like - even from a magazine or a screenshot - and a short list of what matters most. That gives us something concrete to work from on the first visit.",
  },
  {
    cat: "Planning and budgeting",
    q: "How much does a home remodel cost in Orange County?",
    a: "I will not give you a square-foot number because those numbers are almost always wrong. Cost changes based on what the room needs structurally, whether plumbing or electrical moves, the finishes you choose, lead times on materials, and what we find behind the walls. What I can give you is a scope-based estimate with clear allowances and exclusions. That is the only number worth comparing.",
  },
  {
    cat: "Planning and budgeting",
    q: "What is the difference between an estimate, a proposal, and a fixed-price contract?",
    a: "An estimate is an early guess based on limited information. A proposal defines the work, the products, who does what, and what it costs. A fixed-price contract holds that price for that defined scope - but documented owner changes and allowance differences can still move the number. When you compare proposals from different companies, look at what is included first. The bottom line means nothing if the scopes are different.",
  },
  {
    cat: "Planning and budgeting",
    q: "How much contingency should I keep for a remodel?",
    a: "Keep money separate for things we cannot see until walls are open. The right amount depends on the age of the home and how invasive the work is. A cosmetic refresh on a newer home needs less cushion than a full renovation on a 1970s house. Do not count contingency as part of your finish budget - it is there for hidden conditions and decisions you make during construction, not for upgrading tile.",
  },
  {
    cat: "Planning and budgeting",
    q: "Which rooms should I remodel first?",
    a: "Fix any water or safety issues first - no matter what. After that, prioritize the rooms that affect your daily life the most. Kitchens and primary bathrooms tend to create the biggest quality-of-life change. If two rooms share plumbing or flooring, doing them together avoids opening walls twice and helps the home feel cohesive rather than patchwork.",
  },
  {
    cat: "Planning and budgeting",
    q: "Can I remodel my home in phases?",
    a: "Yes, and we do it regularly. The key is having a real plan for all phases before phase one starts - so the first project does not block or contradict what comes next. Flooring transitions, cabinet finishes, paint colors, and future utility locations all need to be decided upfront. Phasing can lower immediate cost but usually raises total cost compared to doing everything at once. Go in with that expectation.",
  },
  {
    cat: "Planning and budgeting",
    q: "How long should I plan before construction begins?",
    a: "More time than most people expect. Between the design conversation, selections, estimating, permits, and material lead times, a well-planned project may spend several weeks or months in preconstruction before demolition. That time is not wasted - it is the work that prevents rushed decisions, incomplete pricing, and schedule gaps once the crew is on site.",
  },
  {
    cat: "Planning and budgeting",
    q: "What is a realistic remodeling timeline?",
    a: "A simple cosmetic update can take a few weeks. A permitted kitchen, multi-room project, or anything structural can take months. The honest answer depends on scope, permit review times in your city, inspection availability, product lead times, and how quickly decisions get made. Ask for a preconstruction schedule and a construction schedule, not just a start date.",
  },
  {
    cat: "Planning and budgeting",
    q: "Can I live in my house during the remodel?",
    a: "Often, yes - but not always comfortably. It depends on how many rooms are affected, whether a working kitchen or bathroom remains, dust management, and the noise situation if you are working from home. We put together a livability plan at the start of every project. For some projects, staying elsewhere for a few weeks genuinely speeds up the work and makes the process easier on everyone.",
  },
  {
    cat: "Planning and budgeting",
    q: "How do I create a wish list that fits my budget?",
    a: "Sort your ideas into three buckets: must-have, high-value, and optional. Attach each one to a problem it solves - storage, light, circulation, maintenance. Price the must-haves first. Then add options one at a time with real costs. That way, when we need to make trade-offs, you are cutting low-priority items, not guessing.",
  },
  {
    cat: "Planning and budgeting",
    q: "Should I remodel for myself or for resale?",
    a: "If you are planning to stay for several years, design for the way you actually live. Avoid irreversible choices with very narrow appeal, but do not torture every decision through a resale filter - you will end up with a house that does not really feel like yours. If a sale is coming soon, focus on condition, function, and things buyers notice first. No remodel guarantees you recover full cost.",
  },
  {
    cat: "Planning and budgeting",
    q: "What should a remodeling budget include?",
    a: "Design, drawings, permits, construction, finish materials, appliances, delivery, tax, installation, protection, cleanup, and a separate owner contingency. Separate firm selections from allowances clearly. The best budget is tied to the actual scope and spec list so every line item has a home and nothing is buried.",
  },
  {
    cat: "Planning and budgeting",
    q: "How can I avoid budget surprises?",
    a: "Complete your selections early. Get everything in writing with clear inclusions and exclusions. Review every allowance. Never approve work based on a verbal conversation. Ask what assumptions were made about walls, subfloor, utilities, and code upgrades. Track every approved change and the remaining contingency in one place throughout the project.",
  },
  {
    cat: "Planning and budgeting",
    q: "What happens during an initial remodeling consultation?",
    a: "We talk through what is not working, look at the space, take photos and measurements, go over realistic investment expectations, and figure out whether the project makes sense for the home. You will not get an instant price at this meeting - that is not how useful pricing works. What you get is a clear sense of scope and next steps.",
  },
  // Hiring and Contracts
  {
    cat: "Hiring and contracts",
    q: "What is a design-build remodeling company?",
    a: "Design and construction are managed together under one accountable process. The people designing the project work directly with the people building it - which means fewer handoffs, better constructability, and one company responsible when something does not go as planned. Ask any design-build firm exactly which services are included: some do true integrated design, and some just have a designer on staff.",
  },
  {
    cat: "Hiring and contracts",
    q: "Should I hire a designer, architect, contractor, or design-build firm?",
    a: "It depends on what the project actually needs. Interior designers focus on function and finishes. Architects are valuable for major spatial changes or anything exterior. Engineers address structural and technical systems. Contractors build. A design-build firm can coordinate all of those roles. What matters is who is responsible for each deliverable - get that in writing.",
  },
  {
    cat: "Hiring and contracts",
    q: "How do I choose a remodeling contractor in Orange County?",
    a: "Check the California license status and classification, insurance, and references. Ask to see a real sample scope and contract - not a flyer. Look at how they communicate and document their process. The company whose paperwork gives you confidence and whose references describe an experience you would want is the right company. The lowest number on an incomplete proposal is not a deal.",
  },
  {
    cat: "Hiring and contracts",
    q: "How can I verify a California contractor's license?",
    a: "Use the Contractors State License Board license check at cslb.ca.gov. Match the business name, license number, classification, status, bond, and workers' compensation information to what is on the proposal. Do this before signing, not after. A city business license or a profile on a third-party marketplace is not a contractor's license.",
  },
  {
    cat: "Hiring and contracts",
    q: "What questions should I ask contractor references?",
    a: "Ask whether the final cost matched what was agreed, how changes were handled, whether the crew showed up consistently, how the home was protected, who you talked to when something came up, and how problems got resolved. The most useful references are for projects similar to yours that finished long enough ago that you can evaluate durability.",
  },
  {
    cat: "Hiring and contracts",
    q: "What should a California home-improvement contract include?",
    a: "California requires a written home-improvement contract with specific notices and terms for covered work. It should identify both parties, include the license number, describe the scope and materials in detail, state the price and payment schedule, identify who pulls permits, explain how changes work, cover cleanup, and spell out warranties and cancellation rights. Read the CSLB guidance before you sign anything.",
  },
  {
    cat: "Hiring and contracts",
    q: "How much can a contractor request as a down payment in California?",
    a: "Under CSLB rules, the down payment for a home-improvement contract generally cannot exceed $1,000 or 10% of the contract price, whichever is less. There is no special-order-material exception. Confirm the current rules with the CSLB and do not pay more than what the contract and the law allow.",
  },
  {
    cat: "Hiring and contracts",
    q: "How should progress payments work?",
    a: "Payments should be tied to clearly described work completed or materials delivered - not arbitrary calendar dates. California guidance says progress payments generally may not exceed the value of work performed or materials on site. Ask for a schedule that is easy to verify, and get receipts or lien releases where appropriate.",
  },
  {
    cat: "Hiring and contracts",
    q: "What is a change order?",
    a: "A change order is a written amendment that documents a change in scope, price, and schedule before the changed work starts. In California, contract changes should be signed before work begins except in true emergencies. A clean change-order process protects both sides - it identifies the reason, shows credits and additions, and keeps a running total.",
  },
  {
    cat: "Hiring and contracts",
    q: "Should I get three bids for my remodel?",
    a: "Multiple proposals can help, but only if each company is pricing the same drawings, same selections, same assumptions, and same responsibilities. Early bids almost never reflect the same project. Compare process, completeness, qualifications, and risk allocation first. When numbers vary significantly, figure out what scope is missing before deciding - a low price built on omissions is not a saving.",
  },
  {
    cat: "Hiring and contracts",
    q: "Why are remodeling proposals so different in price?",
    a: "Scope, labor model, supervision, insurance, allowances, exclusions, permit assumptions, protection, cleanup, and warranty all vary between companies - not just profit margin. Build a side-by-side scope comparison. Pay attention to what each company says about substrate preparation, demolition, plumbing, electrical, and who supplies each product.",
  },
  {
    cat: "Hiring and contracts",
    q: "Will subcontractors work on my project?",
    a: "Most remodelers use licensed specialty trades for some work - that is standard. What matters is who selects, schedules, supervises, and remains accountable for the result. Ask whether subcontractor licenses and insurance are verified and who you call when something is wrong. One qualified project leader owning the outcome is what you are looking for.",
  },
  {
    cat: "Hiring and contracts",
    q: "What should a remodeling warranty cover?",
    a: "The written warranty should separate our workmanship from manufacturer product warranties, state the coverage period clearly, list exclusions, explain how to submit a claim, and identify response expectations. Keep all care instructions, model numbers, color lot numbers, contracts, photos, and final approvals. We cover our labor for 12 months and coordinate manufacturer claims on materials.",
  },
  // Kitchen
  {
    cat: "Kitchen remodeling",
    q: "What is the first step in planning a kitchen remodel?",
    a: "Start by being honest about how the current kitchen fails you. Is it the traffic flow? Not enough prep space? Storage that does not match how you cook? Bad lighting? Write that list first. Then measure the room and think through everything that needs to live in it. Layout decisions come before material decisions - always.",
  },
  {
    cat: "Kitchen remodeling",
    q: "Should I keep my existing kitchen layout?",
    a: "Only if it actually works. Keeping plumbing and walls in place can reduce cost, but it is not automatically the right call. If moving the sink or opening a wall meaningfully improves how the room functions, that trade-off is usually worth it. We always price a keep-layout option and a strategic-change option side by side so you can make an informed decision.",
  },
  {
    cat: "Kitchen remodeling",
    q: "What is a good kitchen work triangle today?",
    a: "The sink, refrigerator, and cooking zone still need to relate logically, but modern kitchens also need multiple prep zones, landing areas, pantry access, and room for more than one person. The bigger issue is keeping household traffic out of the main work zone. Test every cabinet door and appliance door on the plan before anything is ordered.",
  },
  {
    cat: "Kitchen remodeling",
    q: "How do I choose the right kitchen cabinet construction?",
    a: "Look at the box material, back and shelf strength, joinery, drawer construction, hardware, and the finish system - not just the door style. Framed and frameless can both be excellent. The right choice balances how you want the room to look, how long the cabinets need to last, what modifications you need, and what the budget supports. Door style alone tells you almost nothing about cabinet quality.",
  },
  {
    cat: "Kitchen remodeling",
    q: "Are custom cabinets worth it?",
    a: "When the room has unusual dimensions, needs specialized storage, or the design calls for furniture-level details, yes. When the layout is standard and the main priority is a particular finish color or door style, semi-custom often delivers the same result for less. Compare the actual modifications you need, not the category label.",
  },
  {
    cat: "Kitchen remodeling",
    q: "Should upper cabinets go to the ceiling?",
    a: "Ceiling-height cabinets eliminate the dust-catching ledge, create a finished architectural look, and add useful storage for occasional items. They require careful field measurement and may need stacked boxes or crown molding when the ceiling is not perfectly level. Think about whether you will realistically use the top shelf before adding cost for the height.",
  },
  {
    cat: "Kitchen remodeling",
    q: "What countertop material is best for a busy kitchen?",
    a: "There is no single right answer. I always tell people to compare what actually happens to a surface over time: heat, scratching, staining, UV exposure, sealing requirements, and how repairable it is. Quartz, natural stone, porcelain, and sintered surfaces each have strengths and limits. Come to the showroom and look at full slabs with your cabinet and floor samples.",
  },
  {
    cat: "Kitchen remodeling",
    q: "Is quartz better than quartzite or granite?",
    a: "They are not the same material. Engineered quartz is consistent and low-maintenance but has limits with heat and outdoor use. Quartzite and granite are natural stone with unique variation; sealing needs and hardness differ by stone. The question is not which category is better - it is which specific slab, finish, and supplier guidance is right for your project.",
  },
  {
    cat: "Kitchen remodeling",
    q: "Should I use a slab backsplash or tile backsplash?",
    a: "A slab backsplash is a strong look with fewer grout joints. Tile gives you more pattern options, better repairability, and more price flexibility. Think about how outlets are handled, whether you have a range with heat on the wall, and how the seam lands. Mock up the full elevation before you commit.",
  },
  {
    cat: "Kitchen remodeling",
    q: "How big should a kitchen island be?",
    a: "Big enough to be useful, small enough that the room still circulates. An island that makes the perimeter unreachable or creates a long walking path around it has solved one problem by creating another. Test seating clearance, knee space, outlet placement, and every cabinet and appliance door on the plan. The room dimensions, not a trend photo, determine the right size.",
  },
  {
    cat: "Kitchen remodeling",
    q: "Can my kitchen island include a sink, cooktop, or outlets?",
    a: "Yes, if the layout, utilities, ventilation, clearances, and current code support it. A prep sink is straightforward. A cooktop island is more complex because ventilation, clearances, and safety requirements are more demanding. Decide all of this early because slab fabrication, cabinetry, flooring, and utility rough-ins are built around those decisions.",
  },
  {
    cat: "Kitchen remodeling",
    q: "What kitchen lighting should I plan?",
    a: "Layer three things: ambient ceiling light, under-cabinet task light, and accent or island light. Coordinate color temperature and dimming. In California, energy requirements also affect fixture and control choices. The most common mistake is placing light fixtures without looking at the cabinet elevations - do both at the same time.",
  },
  {
    cat: "Kitchen remodeling",
    q: "How do I add more storage without making the kitchen larger?",
    a: "Improve access before you add volume. Wide drawers, pull-outs, tray dividers, appliance garages, and pantry systems can dramatically increase usable capacity in the same footprint. Inventory every small appliance and bulk item during design. More storage is almost never the result of bigger cabinets - it is the result of better organization inside the cabinets you have.",
  },
  {
    cat: "Kitchen remodeling",
    q: "What appliances should be selected before cabinet design is finalized?",
    a: "All of them. Refrigerator, range or cooktop, oven, hood, dishwasher, microwave, and any beverage or wine units. The exact model specification controls every opening dimension, panel size, ventilation requirement, electrical rough-in, and countertop cut. Design around approximate online dimensions and you will be making expensive adjustments after cabinets are ordered.",
  },
  // Bathroom
  {
    cat: "Bathroom remodeling",
    q: "What should I prioritize in a bathroom remodel?",
    a: "Waterproofing, ventilation, plumbing condition, electrical, and clearances before anything decorative. A beautiful bathroom depends entirely on what is behind the tile. I always ask our clients what waterproofing system is going in and whether the substrate will be flood-tested before tile is installed. If a contractor cannot answer that clearly, that is a warning sign.",
  },
  {
    cat: "Bathroom remodeling",
    q: "How long does a bathroom remodel take?",
    a: "Several weeks minimum for a simple refresh. Longer if permits are involved, custom glass or cabinetry is ordered, tile is complex, or we find damage behind the walls. Small rooms are not necessarily fast - many trades work in a tight sequence. The product and glass measurement timing in particular can add weeks that people do not anticipate.",
  },
  {
    cat: "Bathroom remodeling",
    q: "Can I convert my tub to a walk-in shower?",
    a: "Usually yes. The design has to address drain location and capacity, waterproofing, the transition from curb to curbless, slope, glass containment, and ventilation. We always assess the framing and slab conditions first because those can change the best approach. Also think about whether a tub matters for resale in your neighborhood before committing.",
  },
  {
    cat: "Bathroom remodeling",
    q: "Should I keep a bathtub in my home?",
    a: "Keep at least one usable tub if you have children, if bathing is part of anyone's routine, or if buyers in your area expect it. If no one uses the primary-suite tub and the shower is too small, converting the tub footprint to a better shower usually improves daily life more than keeping a tub for hypothetical resale. Look at the whole home's bathroom mix before deciding.",
  },
  {
    cat: "Bathroom remodeling",
    q: "What is required for a curbless shower?",
    a: "A curbless shower requires coordinated floor elevation, drainage, slope, waterproofing, tile layout, and glass containment working together from the start. The structure or concrete slab may need modification. Plan this at the beginning of the project - not after demolition reveals the conditions.",
  },
  {
    cat: "Bathroom remodeling",
    q: "How do I make a shower easier to clean?",
    a: "Keep the layout simple. Use larger-format tile where the slope allows, minimize horizontal ledges, use quality grout properly sealed, make sure horizontal surfaces slope toward the drain, and choose glass that is detailed and treated for maintenance. A handheld showerhead helps. No material or coating makes a shower truly maintenance-free.",
  },
  {
    cat: "Bathroom remodeling",
    q: "What is the best tile for a shower floor?",
    a: "One that is rated for wet areas, accommodates your drain and slope, provides real slip resistance, and is compatible with the installation system. Smaller mosaics traditionally handle traditional slope well; larger formats work with some linear-drain systems. Confirm the manufacturer's use ratings, grout joint requirements, and maintenance with your designer before ordering.",
  },
  {
    cat: "Bathroom remodeling",
    q: "Do I need a shower niche?",
    a: "It is useful storage but it creates additional waterproofing details and affects your tile layout. Size it around the actual products you use, keep it away from the direct spray path, slope the sill, and coordinate the framing before rough-in. A surface-mounted shelf is simpler and sometimes easier to maintain.",
  },
  {
    cat: "Bathroom remodeling",
    q: "How high should bathroom vanity lighting be?",
    a: "There is no single correct height. Place lighting based on user eye level, mirror dimensions, ceiling height, and whether the light comes from above, the sides, or behind the mirror. The goal is even illumination with minimal shadow and no glare. Mark the junction box locations before the drywall goes up.",
  },
  {
    cat: "Bathroom remodeling",
    q: "Should I choose one sink or two?",
    a: "Two sinks help when two people have genuinely overlapping morning routines. They also reduce counter space and drawer depth. One well-planned vanity often gives you better storage and a more usable surface than splitting that space for a second sink. Measure how your household actually uses the room.",
  },
  {
    cat: "Bathroom remodeling",
    q: "How can I improve bathroom ventilation?",
    a: "Install a properly sized, quiet exhaust fan ducted to the exterior - not into the attic - and place it where it can pull air from the wettest zone. Larger or compartmentalized bathrooms may need more than one. Confirm current code requirements and check the existing duct routing before buying anything. Ventilation protects your finishes, but it does not replace proper waterproofing.",
  },
  {
    cat: "Bathroom remodeling",
    q: "What bathroom features support aging in place?",
    a: "A low or no-threshold shower, generous clearances, blocking in the walls for future grab bars, non-slip flooring, a handheld shower, reachable controls, good lighting, and lever hardware. These decisions are far cheaper to build in during a renovation than to retrofit later. Good universal design can look completely residential - it does not have to look institutional.",
  },
  {
    cat: "Bathroom remodeling",
    q: "Can heated floors be installed in an Orange County bathroom?",
    a: "Yes, electric radiant floor warming is common in bathroom renovations. The system, substrate, waterproofing interface, electrical capacity, controls, and floor finish all need to be compatible. Decide before tile installation and document the mat layout carefully - you will want a map of where the wire runs.",
  },
  // Flooring, Tile, Countertops
  {
    cat: "Flooring, tile, and countertops",
    q: "What flooring is best for an Orange County home?",
    a: "It depends on pets, kids, direct sun, moisture, acoustic requirements if you have an HOA, and how the space connects to the outside. Porcelain tile, engineered wood, luxury vinyl, and natural stone solve different problems. I always ask clients to think about the long-term care and the full installed system, not just how the sample looks in the store.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Is luxury vinyl plank a good choice for a remodel?",
    a: "Quality LVP can be excellent - water-resistant, durable, and easy to maintain. But the products vary enormously in core quality, wear layer, locking profile, dimensional stability, and warranty. It still needs a properly prepared substrate. Check the sunlight, temperature, and wet-area restrictions for the specific product before you commit.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "What is the difference between engineered and solid hardwood?",
    a: "Solid hardwood is one species all the way through and can often be refinished multiple times. It moves with humidity and has installation constraints. Engineered wood uses layered construction for greater dimensional stability. Compare the wear-layer thickness, finish, installation method, and how the product handles the moisture conditions in your specific rooms.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Can I install hardwood in a kitchen?",
    a: "Yes, and many homeowners in Orange County do it for visual continuity. You need prompt spill cleanup, protective pads under everything, compatible cleaning products, and realistic expectations about dents over time. Address dishwasher and refrigerator leak protection before installation. Confirm the manufacturer permits the application for the specific product you choose.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Is porcelain tile better than ceramic tile?",
    a: "Porcelain is a type of ceramic with lower water absorption, which makes it suitable for a wider range of applications. Standard ceramic can be an excellent wall or light-duty tile. What matters is the manufacturer's stated application rating, not the category label. Use the product in the conditions it was designed for.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "What tile size makes a small room look larger?",
    a: "Larger tile can reduce grout lines and create a calmer field, but scale needs to fit the room geometry, the slope, and the cutting plan. A small room can also look intentional with smaller-format or mosaic tile. Request a layout drawing or do a dry layout on the floor before anything is set.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "How do I choose grout color?",
    a: "Decide whether grout should blend into the tile or emphasize the pattern. Look at real samples under the actual room's lighting. Think about joint width, how much variation the installation will have, and whether very light or dark grout shows what happens in your household. Confirm the grout is compatible with the tile and the application.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Does grout need to be sealed?",
    a: "It depends on the specific grout product. Some cementitious grouts benefit from a penetrating sealer. Some high-performance or resin-based grouts have different requirements. Sealing slows absorption but does not make grout stain-proof. Follow the manufacturer's instructions for the exact product - not a general rule from the internet.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "What does tile slip resistance mean?",
    a: "Slip performance is influenced by the tile surface, water, contaminants, footwear, the slope, grout joints, and maintenance - not a single test number. Review the manufacturer's use ratings for the exact product. No rating guarantees against slipping. Wet floors, shower floors, entries, and accessible routes deserve careful attention during specification.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Can large-format tile be installed over my existing floor?",
    a: "Sometimes, but only after verifying the assembly is structurally sound, flat, compatible, and within height and load limits. Large-format tile demands tighter substrate-flatness tolerances than smaller tile. Removing the old finish often reveals conditions that should be corrected. Door, cabinet, appliance, and stair heights all matter too.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Why is floor preparation so important?",
    a: "Because the finish floor cannot correct an unstable, damp, contaminated, or uneven substrate. Preparation can include demolition, moisture testing, patching, flattening, crack treatment, underlayment, or structural repair. This is not a place to cut costs. Ask what tolerances and tests apply to your specific product selection.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Can new flooring run continuously through the whole house?",
    a: "Often, and it can make a home feel larger and more cohesive. Check substrate changes, expansion requirements, long-span limits, stairs, wet areas, cabinetry toe-kicks, door heights, and transitions to exterior surfaces first. A single material may not be the right answer everywhere, but coordinated companion materials can preserve the visual flow.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "How do I compare tile and stone samples accurately?",
    a: "Look at multiple pieces in both natural and artificial light. Natural stone and many tiles vary by batch, shade, veining, texture, and finish. Review range samples, lot information, the recommended grout, edge profiles, and the layout plan. When the individual slab pattern materially affects the design, approve the actual slab.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "What should I know about natural stone maintenance?",
    a: "Natural stone varies in porosity, acid sensitivity, scratch resistance, and sealing needs by species and finish. Ask for care guidance for the exact stone and finish you are selecting. Use compatible cleaners, wipe spills promptly, and expect natural variation to continue developing over time. Sealer slows absorption - it does not make stone impervious.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "How do I choose between quartz, porcelain slab, and natural stone?",
    a: "Compare appearance, slab size, seams, edge options, heat and UV limits, scratch and chip behavior, fabrication complexity, repairability, maintenance, warranty, and installed price. The fabricator's experience with the specific product matters. Always select from real material and get current manufacturer documentation before finalizing details.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Can I buy materials through you if the retail price is the same?",
    a: "The value is in the coordination, not a hidden markup. When you buy through us, we verify quantities, review the lot and slab together, manage delivery timing, resolve damage with the supplier, and keep one accountable project record. Any design, handling, or installation fees should be documented separately so you can compare fairly.",
  },
  {
    cat: "Flooring, tile, and countertops",
    q: "Why buy material through the remodeling company rather than a big-box store?",
    a: "Coordination. We know what installation requires, we catch quantity errors before anything is ordered, we verify the lot ships together, and if there is a problem on delivery day, we deal with it - not you. The product price may be similar; the difference is everything that happens between ordering and installation.",
  },
  // Permits
  {
    cat: "Permits and California rules",
    q: "Do I need a permit for a kitchen remodel in Orange County?",
    a: "It depends on the city and the scope. Replacing cabinets and finishes can be treated differently from moving walls, expanding the footprint, or altering electrical, plumbing, gas, or mechanical systems. Rancho Santa Margarita specifically identifies kitchen expansions and utility-system work as permit examples. Confirm requirements with your city's building department before construction starts.",
  },
  {
    cat: "Permits and California rules",
    q: "Do I need a permit for a bathroom remodel?",
    a: "Many bathroom upgrades require permits when plumbing, electrical, ventilation, walls, windows, or waterproofed assemblies are changed. Rancho Santa Margarita lists bathroom upgrades among common permitted improvements. Requirements vary by city and exact scope. Get a written determination from the building department - do not rely on a general statement from anyone.",
  },
  {
    cat: "Permits and California rules",
    q: "Who should obtain the remodeling permit?",
    a: "The contract should state clearly who pulls and pays for permits. For contractor-performed work, the licensed contractor pulling the permit keeps responsibility properly aligned. Be cautious if you are asked to take out an owner-builder permit while a contractor controls the work. Review California owner-builder responsibilities directly with the local building department.",
  },
  {
    cat: "Permits and California rules",
    q: "What is the difference between a building permit and HOA approval?",
    a: "A city permit addresses code compliance and inspections. HOA approval addresses community rules - work hours, acoustic flooring requirements, exterior appearance, elevator protection deposits, and contractor credentials. One does not replace the other. Get both when required and resolve any conflicting conditions before ordering products.",
  },
  {
    cat: "Permits and California rules",
    q: "How long does permit review take?",
    a: "It varies by city, workload, project complexity, and whether corrections come back. Rancho Santa Margarita states plan review can take up to 10 business days for an initial submittal and five for subsequent submittals, but other Orange County cities differ. Build review, revision, and issuance time into your preconstruction schedule.",
  },
  {
    cat: "Permits and California rules",
    q: "What happens during a building inspection?",
    a: "An inspector reviews work at required stages against the approved plans and applicable codes. Work must remain accessible until the inspection passes. Corrections may require a return visit. The permit is not closed until the final inspection is approved. Your construction schedule should identify every inspection hold point so no one covers work before it is signed off.",
  },
  {
    cat: "Permits and California rules",
    q: "Can unpermitted remodeling cause problems when I sell?",
    a: "Yes. Unpermitted work can affect insurance, appraisals, financing, and disclosure obligations. Rancho Santa Margarita warns that owners may have to permit or remove unpermitted modifications before completing a sale. If you have existing work of questionable status, check the local building department's records and options before you build on top of it.",
  },
  {
    cat: "Permits and California rules",
    q: "Are permits required for flooring and painting?",
    a: "Purely cosmetic painting and flooring often do not require a building permit. Rancho Santa Margarita lists them as examples of cosmetic improvements generally exempt. But related structural repair, asbestos disturbance, electrical work, waterproofing, or egress changes can trigger requirements. HOA acoustic approval may still apply to hard flooring installations.",
  },
  {
    cat: "Permits and California rules",
    q: "What should I know about lead paint in an older home?",
    a: "Renovation can create hazardous lead dust in pre-1978 homes. EPA's Renovation, Repair and Painting rule generally requires paid firms disturbing painted surfaces in covered housing to be certified and use lead-safe practices, subject to the rule's details and exceptions. Ask directly how the property will be assessed, contained, cleaned, and documented before work starts.",
  },
  {
    cat: "Permits and California rules",
    q: "Could my remodel disturb asbestos-containing material?",
    a: "Possibly, especially in older flooring, mastics, texture coats, insulation, or cement products. Appearance alone cannot identify asbestos. Before demolition, confirm whether survey, sampling, notification, or special handling is required under South Coast AQMD and other applicable rules. Do not cut, sand, or remove suspect material without knowing what you are dealing with.",
  },
  {
    cat: "Permits and California rules",
    q: "What silica precautions apply when cutting tile or stone?",
    a: "Cutting, grinding, or drilling materials containing crystalline silica creates hazardous respirable dust. The crew should use appropriate dust controls - wet cutting or effective local capture, proper respiratory protection when required, and isolation of the work area. Follow the product's safety data sheet and occupational health rules. This is something we take seriously on every job site.",
  },
  {
    cat: "Permits and California rules",
    q: "Do California energy rules affect kitchen and bathroom lighting?",
    a: "Yes. Alterations can trigger current California energy-efficiency requirements for lighting and controls. Rancho Santa Margarita confirms that kitchen-remodel lighting must comply. Fixture efficacy, switching, vacancy sensors, and dimmer requirements depend on the current adopted standards and the project scope. The lighting plan should be coordinated with the permit set.",
  },
  // Construction and Aftercare
  {
    cat: "Construction and aftercare",
    q: "What happens before demolition starts?",
    a: "Drawings and selections should be finalized, permits confirmed, long-lead products ordered, existing conditions documented, and the home protected. We hold a preconstruction meeting to review utilities, shutoffs, access, staging, and who is responsible for what. Demolition should not be the phase where we discover that the tile, appliances, or fixtures are not decided yet.",
  },
  {
    cat: "Construction and aftercare",
    q: "How will my home be protected from dust and damage?",
    a: "We use floor and wall protection, sealed work zones, filtration when appropriate, dedicated debris routes, daily cleanup, and HVAC precautions. No occupied remodel is dust-free - but thoughtful containment and consistent housekeeping make a significant difference. Ask to see the protection plan in writing before work starts.",
  },
  {
    cat: "Construction and aftercare",
    q: "How often should my project manager communicate with me?",
    a: "We set a predictable schedule before work begins - a weekly written update plus prompt notice any time a decision, delay, inspection, change, or hidden condition comes up. The update covers work completed, next steps, decisions you need to make, schedule risks, and where the budget stands. One point of contact, consistent communication.",
  },
  {
    cat: "Construction and aftercare",
    q: "What causes remodeling delays?",
    a: "Incomplete decisions, permit corrections, failed inspections, concealed damage, utility conflicts, special-order products, shipping damage, trade availability, and owner changes. The best defense is thorough preconstruction, early procurement of long-lead items, schedule buffers for the highest-risk tasks, and fast documented decisions when conditions change.",
  },
  {
    cat: "Construction and aftercare",
    q: "How are concealed conditions handled?",
    a: "When we open walls and find something unexpected - rot, outdated wiring, plumbing that does not match the drawings - we stop, document with photos, explain the options, and issue a written change order before proceeding. The original contract identifies known assumptions and the process for exactly this situation.",
  },
  {
    cat: "Construction and aftercare",
    q: "What should I expect at project completion?",
    a: "A detailed quality walkthrough, a written punch list, final inspections, operational demonstrations, care and warranty information, product records, and confirmation of remaining service items. We define what substantial completion means and what final completion means at the start - not at the end.",
  },
  {
    cat: "Construction and aftercare",
    q: "What is a punch list?",
    a: "A punch list records any incomplete, damaged, or correction items near the end of construction. Walk the project in good lighting with the drawings and specs, group items by trade, assign clear responsibility and target dates, and document completion in writing. A punch list is for finishing contracted work - not for making decisions that should have been made earlier.",
  },
  {
    cat: "Construction and aftercare",
    q: "How should I care for new tile, stone, countertops, cabinets, and floors?",
    a: "Follow the exact manufacturer instructions for each material. We provide a care guide at project completion that covers approved cleaners, cure times, sealing schedules, heat limits, spill response, and humidity guidance. Do not use generic internet cleaning advice on materials with specific requirements - it can void warranties and damage finishes.",
  },
  {
    cat: "Construction and aftercare",
    q: "What documents should I keep after a remodel?",
    a: "The signed contract and all change orders, approved plans, permits and final inspections, invoices, lien releases, warranties, care guides, paint colors, grout and caulk names, slab and tile lot details, appliance model numbers, photos of conditions behind the walls, and service contacts. Keep a digital copy and leave a home record for a future owner.",
  },
  // Trends
  {
    cat: "Design trends",
    q: "What kitchen design trends are homeowners choosing right now?",
    a: "Warm wood cabinetry, transitional rooms that will not feel dated in five years, integrated appliance fronts, slab backsplashes, and better organized storage are showing up in most projects we design. Use trends as direction, not a mandate. The best kitchen is one that still feels right in ten years - and that usually means choosing one or two current ideas and building them into a room with good bones.",
  },
  {
    cat: "Design trends",
    q: "What bathroom design trends are popular right now?",
    a: "Warm neutrals, off-whites, sage and olive accents, low-threshold showers, improved layered lighting, and surfaces that look natural. Calm, spa-like rooms without being clinical. Before adopting a trend, I ask clients to think about maintenance, slip resistance, and whether it fits the home's existing architecture.",
  },
  {
    cat: "Design trends",
    q: "Are white kitchens going out of style?",
    a: "No. All-white is sharing attention with warm woods, cream, taupe, and mixed materials, but a well-proportioned white kitchen is not obsolete. If you like white, add depth through texture, lighting, wood elements, and stone. A white kitchen built on good layout and quality materials will still look right in fifteen years.",
  },
  {
    cat: "Design trends",
    q: "How can I make a remodel feel current without it becoming dated?",
    a: "Put your quieter, more enduring choices into the expensive elements - layout, cabinetry, tile field, flooring, and plumbing locations. Use paint, pendants, hardware, stools, rugs, and decor for the parts that can change without construction. Respect the architecture of the home, keep the material palette controlled, and do not try to incorporate every popular idea into one room.",
  },
  {
    cat: "Design trends",
    q: "What does wellness design mean in a remodel?",
    a: "Good light, effective ventilation, comfortable clearances, non-slip surfaces, easy-to-clean materials, and a floor plan that does not fight against how you actually move through the day. It is less about adding gadgets and more about designing rooms that reduce daily friction. The most effective wellness features are the ones you stop noticing because they just work.",
  },
  {
    cat: "Design trends",
    q: "How can I make my home more sustainable during renovation?",
    a: "Start by preserving what is sound and improving performance where the project opens access. Choose durable, repairable materials over trendy ones with short lifespans. Efficient lighting and appliances, water-saving fixtures, better air sealing, and right-sized mechanical systems all matter more than surface-level green marketing. Verify claims and weigh embodied impact against service life.",
  },
  {
    cat: "Design trends",
    q: "How can I design now so my home works for me later?",
    a: "Build in clearances, step-free routes where feasible, blocking in walls for future grab bars, reachable storage, lever hardware, layered lighting, and easy-maintenance surfaces now - while the walls are open and the cost is low. Future-ready design also means spare electrical capacity, documented wall conditions, and layouts that can adapt without major structural work.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQS.filter((item) => {
      const matchesCat = activeCategory === "All" || item.cat === activeCategory;
      const matchesSearch = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, search]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions - US Floor Design Center",
    "description": "100 questions about home remodeling, kitchen, bathroom, flooring, permits, and design trends answered by Parham Shariat, owner of US Floor Design Center in Rancho Santa Margarita, Orange County.",
    "url": "https://usfloordesign.com/faq",
    "mainEntity": FAQS.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 48px" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Frequently asked questions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44,
                lineHeight: 1.15, color: "var(--text)", maxWidth: "18ch",
              }}>
                Questions we hear every week.
              </h1>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.45, maxWidth: "42ch" }}>
                Straight answers about planning, budgeting, materials, permits, and what to expect from a remodel in Orange County. If your question is not here, ask us directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "16px 0", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              style={{
                padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 0,
                fontSize: 14, color: "var(--text)", background: "var(--surface)",
                fontFamily: "var(--font-body)", width: 260, outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                  style={{
                    padding: "8px 14px", borderRadius: 0, border: "1px solid",
                    borderColor: activeCategory === cat ? "var(--text)" : "var(--line)",
                    background: activeCategory === cat ? "var(--text)" : "#fff",
                    color: activeCategory === cat ? "var(--text-invert)" : "var(--text-muted)",
                    fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ list */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ maxWidth: 840, padding: "16px 0 80px" }}>

            {filtered.length === 0 && (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <p style={{ fontSize: 16, color: "var(--text-muted)" }}>No questions match that search.</p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  style={{
                    marginTop: 16, fontSize: 14, color: "var(--text)", background: "none",
                    border: "1px solid var(--line)", borderRadius: 0, padding: "10px 20px",
                    cursor: "pointer", fontFamily: "var(--font-body)",
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {filtered.map((item) => {
              const globalIndex = FAQS.indexOf(item);
              const isOpen = openIndex === globalIndex;
              return (
                <div key={globalIndex} style={{ borderBottom: "1px solid var(--line)" }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    style={{
                      width: "100%", textAlign: "left", background: "none", border: "none",
                      padding: "22px 0", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {activeCategory === "All" && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                          {item.cat}
                        </div>
                      )}
                      <span style={{ fontSize: 16, color: "var(--text)", fontWeight: 500, lineHeight: 1.45 }}>
                        {item.q}
                      </span>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ paddingBottom: 24 }}>
                      <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.45, margin: 0, maxWidth: "68ch" }}>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "56px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--text)", fontWeight: 400, lineHeight: 1.3, marginBottom: 10 }}>
                Still have a question?
              </p>
              <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.45, maxWidth: "42ch" }}>
                Come into the showroom or schedule a consultation. We would rather talk through the specifics of your project than give you a generic answer.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{
                display: "inline-block",
                background: "var(--red)", color: "var(--text-invert)",
                fontSize: 14, fontWeight: 500, padding: "14px 26px",
                textDecoration: "none", borderRadius: 0,
              }}>
                Schedule a consultation
              </Link>
              <Link href="/showroom" style={{
                display: "inline-block",
                color: "var(--text)", border: "1px solid var(--text)",
                fontSize: 14, padding: "14px 26px",
                textDecoration: "none", borderRadius: 0,
              }}>
                Visit the showroom
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
