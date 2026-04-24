import type { ReactNode } from "react";

export type AppScreen =
  | "basic_settings"
  | "preview_test"
  | "review"
  | "detailed_rules"
  | "ai_json_studio";

interface ScreenOption {
  key: AppScreen;
  label: string;
  description: string;
}

const screenOptions: ScreenOption[] = [
  {
    key: "basic_settings",
    label: "Basic Settings",
    description: "共通土台",
  },
  {
    key: "preview_test",
    label: "Preview / Test",
    description: "確認用画面",
  },
  {
    key: "review",
    label: "Review",
    description: "配信後見直し",
  },
  {
    key: "detailed_rules",
    label: "Detailed Rules",
    description: "正式編集室",
  },
  {
    key: "ai_json_studio",
    label: "AI / JSON Studio",
    description: "外部AI支援",
  },
];

export function AppShell({
  currentScreen,
  onSelectScreen,
  children,
}: {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
        background: "#F3F7F7",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #BFDCDD",
          background: "#EAF7F7",
          padding: "16px 14px",
          display: "grid",
          alignContent: "start",
          gap: "12px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "8px 10px 14px",
            borderBottom: "1px solid #BFDCDD",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#2F3E46",
              fontFamily: "\"Nunito\", \"Noto Sans JP\", system-ui, sans-serif",
            }}
          >
            VTuner
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "#5F747A",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            Phase 1-7 skeleton を App 内で切り替えます。
          </p>
        </div>

        <nav
          style={{
            display: "grid",
            gap: "6px",
          }}
        >
          {screenOptions.map((screen) => {
            const active = screen.key === currentScreen;

            return (
              <button
                key={screen.key}
                type="button"
                onClick={() => onSelectScreen(screen.key)}
                style={{
                  border: `1px solid ${active ? "#4AAEB6" : "transparent"}`,
                  borderRadius: "14px",
                  padding: "12px",
                  background: active ? "#7ECFD4" : "transparent",
                  color: active ? "#2F3E46" : "#5F747A",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "grid",
                  gap: "2px",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "13px",
                    fontFamily: "\"Nunito\", \"Noto Sans JP\", system-ui, sans-serif",
                  }}
                >
                  {screen.label}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    opacity: active ? 0.9 : 1,
                  }}
                >
                  {screen.description}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div
        style={{
          minWidth: 0,
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}
