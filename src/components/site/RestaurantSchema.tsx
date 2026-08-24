export function RestaurantSchema({
  name, description, phone, address, url,
}: {
  name: string;
  description: string;
  phone: string;
  address: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    description,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
    },
    servesCuisine: ["Contemporary", "Wood-fired", "American"],
    priceRange: "$$$",
    url,
    acceptsReservations: "True",
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
