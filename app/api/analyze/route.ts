import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const wordCount = Number.parseInt(formData.get("wordCount") as string) || 175

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert the image to a byte array
    const imageBytes = await imageFile.arrayBuffer()

    // Access the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Prepare the prompt
    const prompt = `
      Analyze this image and write a detailed essay about it. 
      The essay should be approximately ${wordCount} words.
      
      The essay should have a creative title and be written as a continuous piece of text.
      Do not include subheadings or sections - just write a flowing, cohesive essay.
      
      Make the essay engaging, informative, and well-structured.
      
      Return the response in the following JSON format:
      {
        "title": "Essay Title",
        "content": "The full essay content...",
        "sections": []
      }
    `

    // Create a part for the image
    const imagePart = {
      inlineData: {
        data: Buffer.from(imageBytes).toString("base64"),
        mimeType: imageFile.type,
      },
    }

    // Generate content
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    try {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/)

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        const essayData = JSON.parse(jsonStr)
        return NextResponse.json(essayData)
      } else {
        // If JSON parsing fails, create a structured response from the text
        const lines = text.split("\n").filter((line) => line.trim() !== "")
        const title = "Analysis of Your Image"
        const content = text.replace(/^#\s*.*$/m, "").trim() // Remove the title line if it exists

        return NextResponse.json({
          title,
          content,
          sections: [],
        })
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
      return NextResponse.json({ error: "Failed to parse the AI response" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
