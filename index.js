// Import the Express framework
const express = require("express");
const app = express();

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Define the port number where the server will run
const PORT = process.env.PORT || 3000;

// Define a POST endpoint at /bfhl
app.post("/bfhl", (req, res) => {

    // Prepare the response object with default values
    const response = {
        is_success: true,
        user_id: "rakshit_panjeta_23092004",        // full name + DOB
        email: "rakshitpanjeta23@gmail.com",        // email
        roll_number: "2210994880",                  // roll number
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: 0,
        concat_string: ""
    };

    try {
        // Extract "data" array from the request body
        const { data } = req.body;

        // Prepare an array to store alphabet letters for string reversal
        const letters = [];

        //  Validate the input:
        // - Must be an array
        // - Must not be empty
        // - All items should be strings or numbers only
        if (
            !Array.isArray(data) ||
            data.length === 0 ||
            !data.every(item => typeof item === "string" || typeof item === "number")
        ) {
            const err = new Error("Invalid input: data must be a non-empty array of strings or numbers");
            err.code = 400; // custom code to identify bad request
            throw err;
        }

        // Loop through each item in the data array
        for (let item of data) {
            const str = item.toString(); // convert everything to string

            // If it's a number (only digits)
            if (/^[0-9]+$/.test(str)) {
                const num = parseInt(str, 10);
                if (num % 2 === 0) response.even_numbers.push(str);
                else response.odd_numbers.push(str);
                response.sum += num;
            }

            // If it's an alphabet (a-z or A-Z)
            else if (/^[a-zA-Z]+$/.test(str)) {
                response.alphabets.push(str.toUpperCase());
                letters.push(...str); // keep original case for concat_string
            }

            // If it's a special character (not number or letter)
            else {
                response.special_characters.push(str);
            }
        }

        // Reverse the collected letters and apply alternating caps
        const reversed = letters.reverse();
        let concatStr = "";

        reversed.forEach((ch, i) => {
            concatStr += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
        });

        // Store final results in the response object
        response.sum = response.sum.toString(); // sum must be string
        response.concat_string = concatStr;

        // Send a 200 OK response with the result
        res.status(200).json(response);
    }

    // Handle any errors
    catch (error) {

        // If it's a known input error (code 400)
        if (error.code === 400) {
            console.error("Error processing request:", error);
            response.is_success = false;
            res.status(200).json({
                ...response,
                is_success: false,
                error: error.message
            });
        }

        // For unexpected internal errors (e.g., crash)
        else {
            console.error("Unexpected error:", error);
            response.is_success = false;
            res.status(500).json({
                ...response,
                error: "Internal Server Error"
            });
        }
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
