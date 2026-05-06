import Image from "next/image";

const tiles = [
  { src: "/images/community/community-paddle-bench-01.jpg", alt: "Paddle and ball on a park bench" },
  { src: "/images/community/community-paddles-fanned-02.jpg", alt: "Paddles fanned out on a court" },
  { src: "/images/community/community-ball-kitchen-line-03.jpg", alt: "Pickleball on the kitchen line" },
  { src: "/images/community/community-fence-paddle-shoes-04.jpg", alt: "Paddle and court shoes by a fence" },
];

export function CommunityStrip() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
            Real People, Real MoCo
          </h2>
          <p className="text-text-muted">
            From dawn warm-ups at neighborhood courts to round-robins at the rec center.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map((tile) => (
            <div
              key={tile.src}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
