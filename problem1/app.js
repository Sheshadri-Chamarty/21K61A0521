const { default: axios } = require("axios")
const express = require("express")
const app = express()
const port = 5000
let numbers = []
const window_size = 10
function mergeSortedListsUnique(list1, list2) {
  let i = 0,
    j = 0
  const mergedList = []
  const seen = new Set()
  while (i < list1.length && j < list2.length) {
    if (list1[i] < list2[j]) {
      if (!seen.has(list1[i])) {
        mergedList.push(list1[i])
        seen.add(list1[i])
      }
      i++
    } else {
      if (!seen.has(list2[j])) {
        mergedList.push(list2[j])
        seen.add(list2[j])
      }
      j++
    }
  }

  while (i < list1.length) {
    if (!seen.has(list1[i])) {
      mergedList.push(list1[i])
      seen.add(list1[i])
    }
    i++
  }

  while (j < list2.length) {
    if (!seen.has(list2[j])) {
      mergedList.push(list2[j])
      seen.add(list2[j])
    }
    j++
  }

  return mergedList
}

app.get("/numbers/:numberid", async (req, res) => {
  try {
    const numberid = req.params.numberid
    const token = await axios.post(`http://20.244.56.144/test/auth`, {
      companyName: "oneShop",
      clientID: "7d3bb727-e0dd-47df-a98d-f002df4957be",
      clientSecret: "bcNWIUYFhWWshndy",
      ownerName: "Sheshadri",
      ownerEmail: "sheshadri.chamarty@sasi.ac.in",
      rollNo: "21K61A0521",
    })
    const dict = {
      e: "even",
      f: "fibo",
      p: "primes",
      r: "rand",
    }
    const response = await axios.get(
      `http://20.244.56.144/test/${dict[numberid]}`,
      {
        headers: {
          Authorization: `Bearer ${token.data.access_token}`,
        },
      }
    )
    const responseObject = {
      numbers: response.data.numbers,
      windowPrevState: numbers,
    }
    numbers = mergeSortedListsUnique(numbers, response.data.numbers)
    if (numbers.length > window_size) {
      numbers = numbers.slice(-window_size)
    }
    numbers.sort((a, b) => a - b)
    responseObject.windowCurrState = numbers
    responseObject.avg = numbers.reduce((a, b) => a + b, 0) / numbers.length
    // console.log(responseObject)
    res.send(
      JSON.stringify({
        ...responseObject,
      })
    )
  } catch (err) {
    res.send("please try again")
  }
})

app.use((req, res) => {
  res.status(404).send("404: Page not Found")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
