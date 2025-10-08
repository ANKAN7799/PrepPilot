"use server";


import {db} from "@/firebase/admin";
import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {feedbackSchema} from "@/constants";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null>{
    const interviews = await db
        .collection('interviews')
        .where('userId', '==' , userId)
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ... doc.data()
    })) as Interview[];

}


export async function getLatestInterviews(params : GetLatestInterviewsParams): Promise<Interview[] | null>{
    const { userId , limit = 20 } = params;

    const interviews = await db
        .collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==' , true)
        .where('userId', '!=' , userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ... doc.data()
    })) as Interview[];

}


export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db.collection("interviews").doc(id).get();

    return interview.data() as Interview | null;
}


export async function createFeedback(params: CreateFeedbackParams){
    const { interviewId, userId, transcript, feedbackId  } = params;

    try{
        const formattedTranscript = transcript
            .map((sentence : { role: string; content: string}) =>
                `- ${sentence.role}: ${sentence.content}\n`  // this line is besically question and respective answer according to the AI generated answer, this portion is besically representing the relation of question and it's respective answer
            )
            .join('');

        // const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment} } = await generateObject({

    //     const { object } = await generateObject({
    //         model: google("gemini-2.0-flash-001",{
    //             structuredOutputs: false,
    // }),
    //         schema: feedbackSchema,
    //         prompt: `
    //     You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
    //     Transcript:
    //     ${formattedTranscript}
    //
    //     Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
    //     - **Communication Skills**: Clarity, articulation, structured responses.
    //     - **Technical Knowledge**: Understanding of key concepts for the role.
    //     - **Problem-Solving**: Ability to analyze problems and propose solutions.
    //     - **Cultural & Role Fit**: Alignment with company values and job role.
    //     - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
    //     `,
    //         system:
    //             "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    //         // output: 'object',
    //     });

//         const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment} } = await generateObject({
//             model: google('gemini-2.0-flash-001'),
//             schema: feedbackSchema,
//             prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
// Transcript:
// ${formattedTranscript}
//
// Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
// - **Communication Skills**: Clarity, articulation, structured responses.
// - **Technical Knowledge**: Understanding of key concepts for the role.
// - **Problem-Solving**: Ability to analyze problems and propose solutions.
// - **Cultural & Role Fit**: Alignment with company values and job role.
// - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
// `,
//             system:
//                 "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
//             output: 'object', // Add this if you need to disable structured outputs
//         });

//         const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment} } = await generateObject({
//             model: google('gemini-2.0-flash-001'),
//             schema: feedbackSchema,
//             output: 'no-schema', // This tells the SDK to use JSON mode instead of strict schema
//             prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
//
// Transcript:
// ${formattedTranscript}
//
// Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
// - **Communication Skills**: Clarity, articulation, structured responses.
// - **Technical Knowledge**: Understanding of key concepts for the role.
// - **Problem-Solving**: Ability to analyze problems and propose solutions.
// - **Cultural & Role Fit**: Alignment with company values and job role.
// - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
//
// Return the response as a valid JSON object matching this structure:
// {
//   "totalScore": number (0-100),
//   "categoryScores": {
//     "communicationSkills": number,
//     "technicalKnowledge": number,
//     "problemSolving": number,
//     "culturalFit": number,
//     "confidenceClarity": number
//   },
//   "strengths": ["strength1", "strength2", ...],
//   "areasForImprovement": ["area1", "area2", ...],
//   "finalAssessment": "detailed assessment text"
// }
// `,
//             system: "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
//         });


//         const feedback = await db.collection('feedback').add({
//             interviewId,
//             userId,
//             totalScore,
//             categoryScores,
//             strengths,
//             areasForImprovement,
//             finalAssessment,
//             createdAt: new Date().toISOString()
//         })
//
//         return{
//             success: true,
//             feedbackId: feedback.id
//         }
//
//
//
//     }catch(e){
//         console.error('Error saving feedback',e)
//
//         return { success: false }
//
//     }
// }
        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001"),
            schema: feedbackSchema,
            prompt: `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
Transcript:
${formattedTranscript}

Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
- **Communication Skills**: Clarity, articulation, structured responses.
- **Technical Knowledge**: Understanding of key concepts for the role.
- **Problem-Solving**: Ability to analyze problems and propose solutions.
- **Cultural & Role Fit**: Alignment with company values and job role.
- **Confidence & Clarity**: Confidence in responses, engagement, and clarity.

IMPORTANT: For strengths and areasForImprovement, return them as comma-separated strings, NOT arrays.
Example: "Good communication, Clear explanations, Confident delivery"
`,
            system: "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        // const feedback = {
        //     interviewId: interviewId,
        //     userId: userId,
        //     totalScore: object.totalScore,
        //     categoryScores: object.categoryScores,
        //     strengths: object.strengths,
        //     areasForImprovement: object.areasForImprovement,
        //     finalAssessment: object.finalAssessment,
        //     createdAt: new Date().toISOString(),
        // };


        const feedback = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths.split(',').map(s => s.trim()), // ✅ Convert to array
            areasForImprovement: object.areasForImprovement.split(',').map(s => s.trim()), // ✅ Convert to array
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };


        let feedbackRef;

        if (feedbackId) {
            feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = db.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);

        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

export async function getFeedbackByInterviewId(params : GetFeedbackByInterviewIdParams): Promise<Feedback | null>{
    const { interviewId , userId  } = params;

    const feedback = await db
        .collection('feedback')
        .where('interviewId', '==' , interviewId)
        .where('userId', '==' , userId)
        .limit(1)
        .get();

    if(feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];
    return {
        id: feedbackDoc.id, ...feedbackDoc.data()
    } as Feedback;
}