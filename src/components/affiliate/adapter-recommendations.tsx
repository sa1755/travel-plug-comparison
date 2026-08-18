"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import type { JourneyCountry } from "@/components/comparison/travel-plug-journey";
import { trackEvent } from "@/lib/analytics";
import { findAdapterRecommendations } from "@/services/product-recommendation-service";

interface AdapterRecommendationsProps {
  readonly origin: JourneyCountry;
  readonly destination: JourneyCountry;
}

export function AdapterRecommendations({ origin, destination }: AdapterRecommendationsProps) {
  const recommendations = findAdapterRecommendations({
    originCountry: origin.slug,
    destinationCountry: destination.slug,
    originPlugTypes: origin.plugTypes,
    destinationPlugTypes: destination.plugTypes,
  });
  const viewedRef = useRef("");
  const recommendationKey = recommendations.map(({ id }) => id).join(":");

  useEffect(() => {
    if (!recommendationKey || viewedRef.current === recommendationKey) return;
    viewedRef.current = recommendationKey;
    recommendations.forEach((product) => {
      trackEvent("adapter_recommendation_viewed", {
        origin_country: origin.slug,
        destination_country: destination.slug,
        adapter_type: `${origin.plugTypes.join("/")}-to-${destination.plugTypes.join("/")}`,
        retailer: product.retailer,
        product_id: product.id,
      });
    });
  }, [destination, origin, recommendationKey, recommendations]);

  if (!recommendations.length) return null;

  return (
    <section className="adapter-recommendations" aria-labelledby="adapter-recommendations-title">
      <p className="section-label">Optional recommendation</p>
      <h3 id="adapter-recommendations-title">Recommended adapter</h3>
      <div className="adapter-recommendations__grid">
        {recommendations.map((product) => (
          <article key={product.id}>
            <div>
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <small>Sold by {product.retailer}</small>
            </div>
            <TrackedExternalLink
              href={product.affiliateUrl ?? product.productUrl}
              target="_blank"
              rel="sponsored noreferrer"
              eventName="adapter_product_clicked"
              eventProperties={{
                origin_country: origin.slug,
                destination_country: destination.slug,
                adapter_type: `${origin.plugTypes.join("/")}-to-${destination.plugTypes.join("/")}`,
                retailer: product.retailer,
                product_id: product.id,
              }}
              aria-label={`View ${product.name} at ${product.retailer} (opens in a new tab)`}
            >
              View adapter <ExternalLink aria-hidden="true" />
            </TrackedExternalLink>
          </article>
        ))}
      </div>
      <p className="adapter-recommendations__disclosure">Affiliate link: TravelPlug may earn a commission if you purchase through this link, at no extra cost to you.</p>
    </section>
  );
}
