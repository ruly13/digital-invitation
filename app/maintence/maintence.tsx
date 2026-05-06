"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

interface MaintenancePageProps {
  featureName?: string;        // e.g. "karsaloka wedding"
  estimatedTime?: string;      // e.g. "Hari ini, pukul 20:00 WIB"
  whatsappNumber?: string;     // e.g. "6281234567890"
  statusItems?: {
    label: string;
    status: "done" | "active" | "pending";
  }[];
}

const defaultStatus = [
  { label: "Backup data selesai", status: "done" as const },
  { label: "Pembaruan sistem sedang berjalan...", status: "active" as const },
  { label: "Pengujian akhir & deployment", status: "pending" as const },
];

export default function MaintenancePage({
  featureName = "karsaloka wedding",
  estimatedTime,
  whatsappNumber = "6281234567890",
  statusItems = defaultStatus,
}: MaintenancePageProps) {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ h: "--", m: "--", s: "--" });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Countdown if estimatedTime provided (expects HH:MM format today)
  useEffect(() => {
    if (!estimatedTime) return;
    const tick = () => {
      const now = new Date();
      const target = new Date();
      const [h, m] = estimatedTime.split(":").map(Number);
      target.setHours(h, m, 0, 0);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ h: "00", m: "00", s: "00" });
        return;
      }
      const hh = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCountdown({ h: hh, m: mm, s: ss });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [estimatedTime]);

  const waUrl = `https://wa.me/${whatsappNumber}?text=Halo%20Admin%20karsaloka%2C%20saya%20ingin%20bertanya%20tentang%20maintenance...`;

  return (
    <>
      <Head>
        <title>Sedang dalam Perbaikan — karsaloka</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta httpEquiv="refresh" content="300" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="maintenance-root">
        {/* Grid background */}
        <div className="maintenance-grid" aria-hidden="true" />

        {/* Radial glow */}
        <div className="maintenance-glow" aria-hidden="true" />

        {/* Main content */}
        <main className={`maintenance-container ${mounted ? "mounted" : ""}`}>

          {/* Logo */}
          <div className="maintenance-brand" style={{ animationDelay: "0s" }}>
            <Image
              src="/logo2.png"
              alt="karsaloka"
              width={120}
              height={32}
              style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
              priority
            />
          </div>

          {/* Animated gear */}
          <div className="gear-wrap" style={{ animationDelay: "0.1s" }} aria-hidden="true">
            <div className="gear-outer">
              <div className="gear-ring-1" />
              <div className="gear-ring-2" />
              <div className="gear-center">
                <div className="gear-dot" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="maintenance-heading" style={{ animationDelay: "0.2s" }}>
            Sedang dalam{" "}
            <em>Perbaikan</em>
          </h1>

          {/* Subtitle */}
          <p className="maintenance-subtitle" style={{ animationDelay: "0.3s" }}>
            Kami sedang melakukan peningkatan sistem
            <br />
            untuk memberikan pengalaman terbaik bagi Anda.
          </p>

          {/* Feature badge */}
          <div className="maintenance-badge" style={{ animationDelay: "0.4s" }}>
            <span className="badge-dot" />
            {featureName} — dalam perbaikan
          </div>

          {/* Countdown (optional) */}
          {estimatedTime && (
            <div className="countdown-wrap" style={{ animationDelay: "0.45s" }}>
              <div className="countdown-label">Estimasi selesai</div>
              <div className="countdown-grid">
                {[
                  { val: countdown.h, label: "Jam" },
                  { val: countdown.m, label: "Menit" },
                  { val: countdown.s, label: "Detik" },
                ].map(({ val, label }) => (
                  <div key={label} className="countdown-box">
                    <span className="countdown-num">{val}</span>
                    <span className="countdown-lbl">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="status-wrap" style={{ animationDelay: "0.5s" }}>
            <div className="status-label">Status pembaruan</div>
            {statusItems.map((item, i) => (
              <div key={i} className={`status-item status-${item.status}`}>
                {item.status === "done" && <span className="s-icon">✓</span>}
                {item.status === "active" && <span className="s-active-dot" />}
                {item.status === "pending" && <span className="s-icon">○</span>}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="maintenance-footer">
          karsaloka — digital products &nbsp;·&nbsp; semua layanan lain tetap berjalan normal
        </footer>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@300;400&display=swap');

          .maintenance-root {
            background: #0A0A0A;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            font-family: 'DM Mono', monospace;
            color: #fff;
          }

          /* Grid */
          .maintenance-grid {
            position: fixed;
            inset: 0;
            background-image:
              linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: gridMove 20s linear infinite;
            z-index: 0;
          }
          @keyframes gridMove {
            from { transform: translateY(0); }
            to { transform: translateY(60px); }
          }

          /* Glow */
          .maintenance-glow {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 600px; height: 600px;
            background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
          }

          /* Container */
          .maintenance-container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 2rem 1.5rem;
            max-width: 480px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* Stagger children fade-up */
          .maintenance-container > * {
            opacity: 0;
            transform: translateY(20px);
          }
          .maintenance-container.mounted > * {
            animation: fadeUp 0.8s ease forwards;
          }
          @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
          }

          /* Brand */
          .maintenance-brand {
            margin-bottom: 2.5rem;
          }

          /* Gear */
          .gear-wrap {
            margin-bottom: 2rem;
          }
          .gear-outer {
            position: relative;
            width: 72px; height: 72px;
          }
          .gear-ring-1 {
            position: absolute;
            inset: 0;
            border: 0.5px solid rgba(201,169,110,0.3);
            border-radius: 50%;
            animation: spin 12s linear infinite;
          }
          .gear-ring-1::before {
            content: '';
            position: absolute;
            top: -4px; left: 50%;
            transform: translateX(-50%);
            width: 6px; height: 6px;
            background: #C9A96E;
            border-radius: 50%;
          }
          .gear-ring-2 {
            position: absolute;
            inset: 14px;
            border: 0.5px solid rgba(201,169,110,0.2);
            border-radius: 50%;
            animation: spin 8s linear infinite reverse;
          }
          .gear-center {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .gear-dot {
            width: 8px; height: 8px;
            background: #C9A96E;
            border-radius: 50%;
            box-shadow: 0 0 12px #C9A96E;
            animation: pulseDot 2s ease-in-out infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseDot {
            0%, 100% { opacity: 1; box-shadow: 0 0 12px #C9A96E; }
            50% { opacity: 0.4; box-shadow: 0 0 4px #C9A96E; }
          }

          /* Heading */
          .maintenance-heading {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(28px, 6vw, 36px);
            font-weight: 300;
            line-height: 1.25;
            margin-bottom: 1rem;
          }
          .maintenance-heading em {
            color: #C9A96E;
            font-style: italic;
          }

          /* Subtitle */
          .maintenance-subtitle {
            font-size: 11px;
            font-weight: 300;
            color: rgba(255,255,255,0.4);
            line-height: 1.9;
            letter-spacing: 0.04em;
            margin-bottom: 1.75rem;
          }

          /* Badge */
          .maintenance-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(201,169,110,0.1);
            border: 0.5px solid rgba(201,169,110,0.35);
            padding: 6px 14px;
            font-size: 10px;
            letter-spacing: 0.15em;
            color: #C9A96E;
            text-transform: uppercase;
            margin-bottom: 1.75rem;
          }
          .badge-dot {
            width: 5px; height: 5px;
            background: #C9A96E;
            border-radius: 50%;
            animation: pulseDot 1.5s ease-in-out infinite;
          }

          /* Countdown */
          .countdown-wrap {
            margin-bottom: 1.5rem;
            width: 100%;
          }
          .countdown-label {
            font-size: 9px;
            letter-spacing: 0.3em;
            color: rgba(255,255,255,0.3);
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .countdown-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .countdown-box {
            background: #111;
            border: 0.5px solid rgba(255,255,255,0.06);
            border-radius: 4px;
            padding: 12px 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .countdown-num {
            font-size: 22px;
            color: #C9A96E;
            font-family: 'Cormorant Garamond', serif;
            line-height: 1;
          }
          .countdown-lbl {
            font-size: 9px;
            color: rgba(255,255,255,0.3);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 4px;
          }

          /* Status */
          .status-wrap {
            border: 0.5px solid rgba(255,255,255,0.06);
            padding: 16px 20px;
            margin-bottom: 1.75rem;
            text-align: left;
            width: 100%;
          }
          .status-label {
            font-size: 9px;
            letter-spacing: 0.3em;
            color: rgba(255,255,255,0.3);
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          .status-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 11px;
            letter-spacing: 0.03em;
            margin-bottom: 8px;
          }
          .status-item:last-child { margin-bottom: 0; }
          .status-item.status-done {
            color: rgba(255,255,255,0.3);
            text-decoration: line-through;
            text-decoration-color: rgba(255,255,255,0.15);
          }
          .status-item.status-active { color: #fff; }
          .status-item.status-pending { color: rgba(255,255,255,0.2); }
          .s-icon { font-size: 10px; width: 14px; text-align: center; flex-shrink: 0; }
          .s-active-dot {
            width: 6px; height: 6px;
            background: #C9A96E;
            border-radius: 50%;
            flex-shrink: 0;
            animation: pulseDot 1.2s ease-in-out infinite;
          }

          /* Divider */
          .maintenance-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1.25rem;
            width: 100%;
          }
          .div-line {
            flex: 1;
            height: 0.5px;
            background: rgba(255,255,255,0.08);
          }
          .div-text {
            font-size: 9px;
            letter-spacing: 0.25em;
            color: rgba(255,255,255,0.25);
            text-transform: uppercase;
            white-space: nowrap;
          }

          /* WA Button */
          .wa-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: 0.5px solid rgba(201,169,110,0.4);
            color: #C9A96E;
            font-family: 'DM Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            padding: 12px 28px;
            background: transparent;
            cursor: pointer;
            transition: background 0.3s ease, box-shadow 0.3s ease, letter-spacing 0.3s ease;
            text-decoration: none;
          }
          .wa-btn:hover {
            background: rgba(201,169,110,0.08);
            box-shadow: 0 0 24px rgba(201,169,110,0.12);
            letter-spacing: 0.25em;
          }

          /* Footer */
          .maintenance-footer {
            position: fixed;
            bottom: 1.5rem;
            left: 0; right: 0;
            text-align: center;
            font-size: 9px;
            letter-spacing: 0.2em;
            color: rgba(255,255,255,0.12);
            text-transform: uppercase;
            z-index: 1;
          }
        `}</style>
      </div>
    </>
  );
}