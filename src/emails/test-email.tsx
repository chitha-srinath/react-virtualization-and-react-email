import {
  Button,
  Html,
  pixelBasedPreset,
  Tailwind,
} from "@react-email/components";

export default function Email() {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Button
          href="https://example.com"
          className="bg-black text-white p-4 rounded-md"
        >
          Click me
        </Button>
      </Tailwind>
    </Html>
  );
}
