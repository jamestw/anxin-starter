import 'package:flutter/material.dart';

/// 安心行 設計 token —— Flutter 用（與 tokens.css 同一組值）。
/// 專案只改 brand / cta；語意色與車趟狀態色全系統固定。
abstract final class AnxinTokens {
  // ---- 品牌（專案自選）----
  static const Color brand = Color(0xFF1C3DD1);
  static const Color brandSoft = Color(0xFFEEF2FF);
  static const Color cta = Color(0xFFF59E0B);
  static const Color ctaSoft = Color(0xFFFFF4DB);
  static const Color onCta = Color(0xFF613B00);

  // ---- 中性色 ----
  static const Color bg = Color(0xFFF3F5F9);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);
  static const Color text = Color(0xFF0F172A);
  static const Color text2 = Color(0xFF334155);
  static const Color muted = Color(0xFF64748B);

  // ---- 語意色 ----
  static const Color success = Color(0xFF067647);
  static const Color successSoft = Color(0xFFECFDF3);
  static const Color warn = Color(0xFFB54708);
  static const Color warnSoft = Color(0xFFFFFAEB);
  static const Color danger = Color(0xFFD92D20);
  static const Color dangerSoft = Color(0xFFFEF3F2);
  static const Color info = Color(0xFF1D4ED8);
  static const Color infoSoft = Color(0xFFEFF6FF);

  // ---- 車趟狀態 ----
  static const Color tripAssigned = Color(0xFF1D4ED8);
  static const Color tripAssignedSoft = Color(0xFFEFF6FF);
  static const Color tripDeparted = Color(0xFFB45309);
  static const Color tripDepartedSoft = Color(0xFFFFF4DB);
  static const Color tripOnboard = Color(0xFF067647);
  static const Color tripOnboardSoft = Color(0xFFE3F6EC);
  static const Color tripDone = Color(0xFF64748B);
  static const Color tripDoneSoft = Color(0xFFEEF1F6);
  static const Color tripAlert = Color(0xFFD92D20);
  static const Color tripAlertSoft = Color(0xFFFDE8E6);

  // ---- 字型與圓角 ----
  static const List<String> fontFallback = ['Noto Sans TC', 'PingFang TC'];
  static const double radiusSm = 6;
  static const double radius = 8;
  static const double radiusLg = 12;
}
