import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#070706",
          color: "#f4efe6",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: 64,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(115deg, rgba(255,122,24,0.42), rgba(66,165,255,0.16) 44%, rgba(7,7,6,0) 72%)",
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        />
        <div
          style={{
            border: "1px solid rgba(244,239,230,0.18)",
            bottom: 38,
            display: "flex",
            left: 38,
            position: "absolute",
            right: 38,
            top: 38,
          }}
        />
        <div
          style={{
            background: "#ff7a18",
            display: "flex",
            height: 12,
            left: 64,
            position: "absolute",
            top: 64,
            width: 96,
          }}
        />
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#ffbd59",
              display: "flex",
              fontFamily: "Courier New, Courier, monospace",
              fontSize: 24,
              letterSpacing: 8,
              marginTop: 42,
              textTransform: "uppercase",
            }}
          >
            First playable demo in development
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: 0,
              lineHeight: 0.96,
              textTransform: "uppercase",
            }}
          >
            <span>Build the kart.</span>
            <span>Race the habitat.</span>
            <span>Earn your place.</span>
          </div>
        </div>
        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              color: "rgba(244,239,230,0.78)",
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              maxWidth: 760,
            }}
          >
            A sci-fi RC kart racing game set inside humanity&apos;s last Titan
            colony.
          </div>
          <div
            style={{
              color: "#ff7a18",
              display: "flex",
              fontFamily: "Courier New, Courier, monospace",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Titan Racers
          </div>
        </div>
      </div>
    ),
    size,
  );
}
