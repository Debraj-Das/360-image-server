# Image API

This project is a lightweight Node.js and Express API that serves as a dynamic image redirect service. It uses a custom URL structure to look up an image's `public_id` from a Supabase database and then redirects to the corresponding image URL on Cloudinary. The API also supports on-the-fly image transformations through URL query parameters.

This service is designed to be hosted on a serverless platform like Vercel.

-----

## ⚙️ Features

  * **Clean URL Structure:** Access images via a clean, predictable URL: `/images/:productId/:skuCode/:imageNo`.
  * **Dynamic Redirection:** Maps custom URLs to Cloudinary assets.
  * **On-the-Fly Transformations:** Apply Cloudinary image transformations (resize, crop, quality) directly through URL query parameters.
  * **Database Integration:** Uses Supabase (PostgreSQL) to store the mapping between product info and Cloudinary `public_id`s.
  * **Serverless Ready:** Configured for easy deployment on Vercel.

-----

## 🚀 Getting Started

### Prerequisites

  * Node.js (v18 or later)
  * A Cloudinary account
  * A Supabase project
  * Git

### 1\. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Set Up Environment Variables

Create a `.env` file in the root of your project and add the following variables with your credentials:

```env
# Cloudinary Credentials
CLOUDNAME=your_cloudinary_cloud_name
APIKEY=your_cloudinary_api_key
APISECRET=your_cloudinary_api_secret

# Supabase Credentials
SUPABASE_URL=your_supabase_project_url
# For backend services, it's recommended to use the service_role key
SUPABASE_KEY=your_supabase_service_role_key

# Server Port (optional, defaults to 3000)
PORT=3000
```

### 4\. Run the Server Locally

```bash
npm start
```

The server will start, and you'll see the message: `Image server running on Port:3000`.

-----

## ☁️ Live API Endpoint

The API is deployed on Vercel and is available at the following base URL:

**`https://360-image-server-umcu.vercel.app`**

You can use this base URL for all API requests.

-----

## 📖 API Documentation

The server exposes two main endpoints.

### Health Check ❤️‍🩹

This endpoint is used to verify that the API server is running and responsive.

  * **Method:** `GET`
  * **Endpoint:** `/health`
  * **Success Response (200 OK):**
      * Returns the plain text message: `api server is good health`

#### Example

```
https://360-image-server-umcu.vercel.app/health
```

### Image Redirect 🖼️

This endpoint retrieves a specific product image and redirects to the Cloudinary URL.

  * **Method:** `GET`
  * **Endpoint:** `/images/:productId/:skuCode/:imageNo`

#### Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `productId` | `String` | The unique identifier for the product. |
| `skuCode` | `String` | The SKU code for the specific product variant. |
| `imageNo` | `Integer` | The sequential number of the image (e.g., 1, 2). |

#### Optional Query Parameters (for Transformations)

| Parameter | Description | Valid Values |
| :--- | :--- | :--- |
| `w` | Sets the **width** of the image in pixels. | Any integer (e.g., `400`). |
| `h` | Sets the **height** of the image in pixels. | Any integer (e.g., `300`). |
| `c` | Sets the **crop mode**. | `fill`, `fit`, `scale`, `thumb`, etc. |
| `q` | Sets the **quality** of the image. | `auto`, or an integer 1-100. |

#### Responses

  * **Success (200 OK -\> 302 Found):** Redirects to the final Cloudinary image URL.
  * **Error (404 Not Found):** Returns `Image not found`.
  * **Error (500 Internal Server Error):** Returns `Internal Server Error`.

#### Example Usage

  * **Get original image:**
    `https://360-image-server-umcu.vercel.app/images/5451133059240/archer-sand/1`
  * **Get a 400px wide version:**
    `https://360-image-server-umcu.vercel.app/images/5451133059240/archer-sand/1?w=400`
  * **Get a 500x500 cropped thumbnail:**
    `https://360-image-server-umcu.vercel.app/images/5451133059240/archer-sand/1?w=500&h=500&c=thumb`
