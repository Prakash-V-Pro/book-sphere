# Contentstack Content Models (BookSphere)

## GlobalConfig
- geoIpEndpoint (string, required)
- paymentGateways (multi-select string)
- featureFlags (JSON: { parking, discounts, recommendations })

## Event
- title (string)
- slug (string, unique)
- type (select: concert, movie, sports, theater, other)
- currency (string)
- schedule (group: startAt, bookingOpensAt, bookingClosesAt)
- venue (group: name, address, city, country, location lat/lng)
- about (multi-line text)
- tags (multi-select string)
- isPromoted (boolean)
- banner (asset)
- gallery (assets)
- seatMap (reference: SeatMap)
- basePrice (number)
- priceCurve (select: decrease_with_distance, increase_with_distance)
- parkingAvailable (boolean)

## SeatMap
- title (string)
- orientation (select: stage_top, screen_top)
- zones (JSON array: [{ id, label, distanceFactor, basePrice, rows, cols }])

## Banner
- title (string)
- subtitle (string)
- image (asset)
- link (string)

## Promotion
- title (string)
- badgeText (string)
- event (reference: Event)

## RecommendationRule
- interestTags (multi-select string)
- eventTags (multi-select string)

## TierRule
- key (select: tier1, tier2, normal)
- label (string)
- maxTickets (number)

## NotificationTemplate
- channel (select: email, sms, in_app)
- subject (string)
- body (rich text)

## EventSection
- title (string)
- slug (string, unique)
- events (references: Event, multiple)
- layout (string, example: carousel)

## Notes
- Use Contentstack Automate for workflows: publish events, run promotions, update pricing.
- Use Contentstack Personalize to target recommendations by interest tags and location.

