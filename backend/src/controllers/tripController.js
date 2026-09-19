//recive the user information
//validate the required information
//send the info to out at AI planner
//calculate the budget per night
//search mongodb for suitable properties
//send both AI trip plan + matching properties back to the frontend /user

import { Property } from "../Models/propertyModel.js";
import { planTrip } from "../ai/tripPlanner.js";
import { generateDescription } from "../ai/generateDescription.js";

const cleanCity = (text) => text.trim();

const createTripPlan = async (req, res) => {
    try {
        const {
            destination,
            budget,
            days,
            people,
            interests
        } = req.body;

        if (!destination || !budget || !days || !people || !interests) {
            return res.status(400).json({
                status: "fail",
                message: "Please fill in destination, budget, days, people, and interests"
            });
        }

        const plan = await planTrip({
            destination,
            budget,
            days,
            people,
            interests: interests || []
        });

        const totalBudget = Number(budget);
        const numberOfDays = Number(days);
        const numberOfPeople = Number(people);

        const perNight = totalBudget / numberOfDays;

        const city = cleanCity(destination);

        console.log("========== TRIP SEARCH ==========");
        console.log("Destination:", city);
        console.log("Budget:", totalBudget);
        console.log("Days:", numberOfDays);
        console.log("People:", numberOfPeople);
        console.log("Per Night:", perNight);

        let properties = await Property.find({
            $or: [
                {
                    "address.city": {
                        $regex: city,
                        $options: "i"
                    }
                },
                {
                    "address.state": {
                        $regex: city,
                        $options: "i"
                    }
                },
                {
                    "address.area": {
                        $regex: city,
                        $options: "i"
                    }
                }
            ],
            maximumGuest: {
                $gte: numberOfPeople
            }
        })
        .sort({ price: 1 })
        .limit(6);

        console.log("Properties found:", properties.length);

        // If no properties match the destination + guest count,
        // try destination only.
        if (properties.length === 0) {

            console.log("Trying destination-only search...");

            properties = await Property.find({
                $or: [
                    {
                        "address.city": {
                            $regex: city,
                            $options: "i"
                        }
                    },
                    {
                        "address.state": {
                            $regex: city,
                            $options: "i"
                        }
                    },
                    {
                        "address.area": {
                            $regex: city,
                            $options: "i"
                        }
                    }
                ]
            })
            .sort({ price: 1 })
            .limit(6);
        }

        console.log("Final properties:", properties.length);
        console.log("================================");

        return res.status(200).json({
            status: "success",
            data: {
                plan,
                properties,
                perNight
            }
        });

    } catch (error) {

        console.error("Trip Plan Error:", error);

        return res.status(500).json({
            status: "fail",
            message: error.message || "Could not create a trip plan, please try again"
        });
    }
};


const writeDescription = async (req, res) => {

    try {

        const description = await generateDescription(req.body);

        return res.status(200).json({
            status: "success",
            data: {
                description
            }
        });

    } catch (error) {

        console.error("Description Error:", error);

        return res.status(500).json({
            status: "fail",
            message: "Could not generate a description"
        });
    }
};


export { createTripPlan, writeDescription };