const express = require("express")
const app = express()
const axios = require("axios")
const port = 5000
app.get("/categories/:category/products", async (req, res) => {
  const query = req.query
  console.log(query)
  const token = await axios.post(`http://20.244.56.144/test/auth`, {
    companyName: "oneShop",
    clientID: "7d3bb727-e0dd-47df-a98d-f002df4957be",
    clientSecret: "bcNWIUYFhWWshndy",
    ownerName: "Sheshadri",
    ownerEmail: "sheshadri.chamarty@sasi.ac.in",
    rollNo: "21K61A0521",
  })
  const category = req.params.category
  const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"]
  const categories = [
    "Phone",
    "Computer",
    "TV",
    "Earphone",
    "Tablet",
    "Pendrive",
    "Remote",
    "Speaker",
    "Headset",
    "Laptop",
    "PC",
  ]
  const data = []

  for (const company of companies) {
    const response = await axios.get(
      `http://20.244.56.144/test/companies/${company}/categories/${category}/products?top=${query["n"]}&minPrice=100&maxPrice=1000`,
      {
        headers: {
          Authorization: `Bearer ${token.data.access_token}`,
        },
      }
    )
    response.data.forEach((product) => {
      data.push({
        ...product,
        company: company,
        productId: `${company}-${category}-${product.productName}`,
      })
    })
  }
  console.log(data)
  if (query["sort"]) {
    data.sort((a, b) => {
      if (query["sort"] === "price") {
        return a.price - b.price
      } else if (query["sort"] === "rating") {
        return b.rating - a.rating
      } else if (query["sort"] === "company") {
        return a.company.localeCompare(b.company)
      }
    })
  }
  if (query["sort_type"] === "desc") {
    data.reverse()
  }
  if (data.length > query["n"]) {
    data = data.slice(0, query["n"])
  }
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get("/categories/:category/products/:productId", async (req, res) => {
  const productId = req.params.productId
  const token = await axios.post(`http://20.244.56.144/test/auth`, {
    companyName: "oneShop",
    clientID: "7d3bb727-e0dd-47df-a98d-f002df4957be",
    clientSecret: "bcNWIUYFhWWshndy",
    ownerName: "Sheshadri",
    ownerEmail: "sheshadri.chamarty@sasi.ac.in",
    rollNo: "21K61A0521",
  })
  const company = productId.split("-")[0]
  const category = productId.split("-")[1]
  const productName = productId.split("-")[2]
  const response = await axios.get(
    `http://20.244.56.144/test/companies/${company}/categories/${category}/products`
  )
  const data = response.data.find(
    (product) => product.productName === productName
  )
  res.send(data)
})
