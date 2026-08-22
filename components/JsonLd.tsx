/**
 * Les données structurées, telles que Google les attend.
 *
 * Un script JSON, pas du texte visible : c'est ce qui permet à un moteur de
 * comprendre qu'il a affaire à un plat, à son prix et à sa disponibilité,
 * plutôt qu'à une page quelconque.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // Le contenu vient de notre catalogue, pas d'une saisie de visiteur.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
