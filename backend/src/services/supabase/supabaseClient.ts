import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE!;

export const supabase = createClient(supabaseUrl, supabaseAdmin, {});
