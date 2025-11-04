import mockup from "@assets/generated_images/Video_editor_interface_mockup_4f8f654d.png";
import stickman1 from "@assets/generated_images/Stickman_waving_hello_frame_412aab8a.png";
import stickman2 from "@assets/generated_images/Stickman_walking_frame_6f587a30.png";
import stickman3 from "@assets/generated_images/Stickman_jumping_celebration_749d6d00.png";
import stickman4 from "@assets/generated_images/Stickman_working_at_desk_62a5cf30.png";

const features = [
  {
    title: "Intelligent Scene Generation",
    description: "Google Gemini analyzes your script and generates contextually appropriate stickman illustrations for each scene. Every frame is unique and tailored to your story.",
    image: "grid",
    reverse: false,
  },
  {
    title: "Professional Narration",
    description: "ElevenLabs provides studio-quality text-to-speech narration with natural voices and perfect timing. Choose from multiple voice options to match your video's tone.",
    image: mockup,
    reverse: true,
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create engaging stickman animation videos
          </p>
        </div>
        
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                feature.reverse ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={`space-y-6 ${feature.reverse ? "lg:order-2" : ""}`}>
                <h3 className="text-3xl font-bold font-display">{feature.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              <div className={feature.reverse ? "lg:order-1" : ""}>
                {feature.image === "grid" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[stickman1, stickman2, stickman3, stickman4].map((img, i) => (
                      <div key={i} className="rounded-lg border bg-card p-4">
                        <img src={img} alt={`Stickman frame ${i + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border shadow-lg overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-full h-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
