export function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "32px",
        background: "#F3F7F7",
        color: "#2F3E46",
        fontFamily: "\"Noto Sans JP\", system-ui, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "24px",
          background: "#FFFFFF",
          border: "1px solid #BFDCDD",
          borderRadius: "20px",
          boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "28px",
            fontWeight: 800,
          }}
        >
          VTuner Frontend Baseline
        </h1>
        <p style={{ margin: "0 0 12px", lineHeight: 1.7 }}>
          React + TypeScript + Vite の最小実行基盤です。
          まだ 5 画面の本格 UI 実装には入っていません。
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Preview / Test、Basic Settings、Review、Detailed Rules、
          AI / JSON Studio は今後の skeleton 実装で順番に追加します。
        </p>
      </section>
    </main>
  );
}
