import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { TABLES } from "@/lib/supabase/table-names"

/** sasaeai_profiles.is_admin === true のみ管理者 */
export function isSasaeaiAdmin(profile: { is_admin?: boolean | null } | null | undefined): boolean {
  return profile?.is_admin === true
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** 通報詳細 URL の id パラメータ検証 */
export function isValidReportId(id: string | undefined | null): id is string {
  return typeof id === "string" && UUID_RE.test(id.trim())
}

/** 管理画面 layout 用: 未ログイン・非管理者はダッシュボードへ */
export async function requireAdminLayoutSession(): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await verifyAdminAccess(user.id))) {
    redirect("/dashboard")
  }
}

/** 指定ユーザーが管理者か（RLS 下の anon セッションで profiles を参照） */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase.from(TABLES.PROFILES).select("is_admin").eq("id", userId).maybeSingle()
  return isSasaeaiAdmin(profile)
}

/** 管理画面ヘッダー用（select * は RLS 等で失敗しうるため必要列のみ） */
export const ADMIN_HEADER_PROFILE_SELECT = "id, nickname, display_name, email, is_admin, membership_status"

export async function fetchAdminHeaderProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .select(ADMIN_HEADER_PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    console.error("[admin] fetchAdminHeaderProfile:", error.message)
  }
  return data
}
