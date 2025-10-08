import express from "express"
import { Cloudinary } from "@cloudinary/url-gen"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()
const app = express()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


async function getPublicIdFromDb(productId, skuCode, imageNo) {
	try {
		const { data, error } = await supabase
			.from("product")
			.select("public_id")
			.eq("product_id", productId)
			.eq("sku_code", skuCode)
			.eq("image_no", parseInt(imageNo, 10))
			.single()

		if (error) {
			console.error("Error fetching public-id:", error.message)
			return null
		}

		return data ? data?.public_id : null
	} catch (err) {
		console.error("An unexpected error occurred", err)
		return null
	}
}

const cld = new Cloudinary({
	cloud: {
		cloudName: process.env.CLOUDNAME,
	},
})

// Define the route to handle the image requests with optiona transformations
app.get("/images/:productId/:skuCode/:imageNo", async (req, res) => {
	
	let { productId, skuCode, imageNo } = req.params
	const { w, h, c, q, watermark } = req.query // Destructure query params (w: width, h: height, c: crop, q: quality, watermark: true/false)

	productId = "5451133059240"
	skuCode = "32004-cinnamon-brown"


	try {
		const publicId = await getPublicIdFromDb(productId, skuCode, imageNo)

		if (!publicId) {
			return res.status(404).send("Image not found")
		}

		// Start building the Cloudinary image object
		let image = cld.image(publicId)

		// Conditionally apply transformations based on query parameters
		const transformations = []
		if (w) transformations.push(`w_${w}`)
		if (h) transformations.push(`h_${h}`)
		if (c) transformations.push(`c_${c}`)

		if (transformations.length > 0) {
			image = image.resize(transformations.join(","))
		}

		if (q) {
			image = image.quality(q)
		}

		// Always apply smart format and quality settings for optimization
		image = image.format("auto").quality("auto")

		// Generate the URL and conditionally add watermark
		let imageUrl = image.toURL()
		
		// Only add watermark if watermark parameter is 'true'
		if (watermark === 'true') {
			// Add watermark parameters to the URL (insert before the image public_id)
			// Format: /l_watermark_public_id,g_south_east,x_10,y_10,w_100/
			const watermarkParams = "l_tendrilsio_logo_qnpef1,g_south_east,x_10,y_10,w_100"
			const urlParts = imageUrl.split('/upload/')
			if (urlParts.length === 2) {
				imageUrl = `${urlParts[0]}/upload/${watermarkParams}/${urlParts[1]}`
			}
		}

		res.redirect(302, imageUrl)
	} catch (error) {
		console.error("Error redirecting to image:", error)
		res.status(500).send("Internal Server Error")
	}
})

app.get("/health", (req, res) => {
	res.send("api server is good health");
})

app.get("/",(req, res) => {
	res.send("Home route of this api");
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Image server running on Port:${PORT}`)
})
