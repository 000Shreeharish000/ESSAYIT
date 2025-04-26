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
      The essay should have a creative title 
      Return the response in the following JSON format:
      {
        "title": "Essay Title",
        "content": "The full essay content...",
        "sections": []
      }
1. A creative and engaging title
2. Introduction (4-5 sentences) that presents the image and main points
3. Four distinct sections with appropriate subheadings:
   - First subheading: [specific aspect of the image]
   - Second subheading: [specific aspect of image]  
   - Third subheading: [specific aspect of image]
   - Fourth subheading: [specific aspect of image]
   - Each subheading should be bold
  - Insert two blank lines before each subheading
4. Conclusion (3-4 sentences) that summarizes the main points and provides closing thoughts
Format requirements:
- Format each subheading on its own separate line
- Each section should be 2-3 lines
- Total word count: approximately ${wordCount} words
- Use a formal tone and avoid slang

Make the essay engaging, informative, and well-structured 
    `

    
    const imagePart = {
      inlineData: {
        data: Buffer.from(imageBytes).toString("base64"),
        mimeType: imageFile.type,
      },
    }

    
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    
    try {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/)

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        const essayData = JSON.parse(jsonStr)
        return NextResponse.json(essayData)
      } else {
        // If JSON parsing fails, create a structured response from the text
        const lines = text.split("\n").filter((line) => line.trim() !== "")
        const title = "ESSAY FROM YOUR IMAGE"
        const content = text.replace(/^#\s*.*$/m, "").trim() 

        return NextResponse.json({
          title,
          content,
          sections: [],
        })
      }
    } catch (error) {
      console.error("Error parsing response:", error)
      return NextResponse.json({ error: "Failed to parse the AI response" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
