import { supabase } from "../lib/supabase";

/**
 * Save a new resume for the currently authenticated user.
 * @param {object} resumeData - the resume data object
 * @returns {Promise<object>} the inserted row
 */
export const saveResume = async (resumeData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const title = `${resumeData.name || "My Resume"} — ${resumeData.role || "Resume"}`;

    const { data, error } = await supabase
        .from("resumes")
        .insert({ user_id: user.id, title, data: resumeData })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetch all resumes for the currently authenticated user.
 * @returns {Promise<Array>} array of resume rows
 */
export const getResumes = async () => {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Delete a resume by its id.
 * @param {string} id - uuid of the resume row
 */
export const deleteResume = async (id) => {
    const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

/**
 * Update the title of a resume.
 * @param {string} id - uuid of the resume row
 * @param {string} title - new title
 */
export const updateResumeTitle = async (id, title) => {
    const { error } = await supabase
        .from("resumes")
        .update({ title })
        .eq("id", id);

    if (error) throw error;
};
