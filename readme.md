# Clinikally Project

Clinikally is a cutting-edge React Native application that revolutionizes the healthcare experience. With its intuitive user interface and a range of innovative features, Clinikally empowers users to effortlessly manage their healthcare needs.

## Getting Started

To get started, follow these steps:

1. Clone the repository:
```
git clone https://github.com/Avenster/clinikally-project.git
```

2. Navigate to the project directory:
```
cd clinikally-project
```

3. Remove the existing `node_modules` folder and `package-lock.json` file:
```
rm -rf node_modules
rm package-lock.json
```

4. Install the dependencies:
```
npm install
```

5. Run the application on your desired platform:
```
npm run <your_platform>
```

Replace `<your_platform>` with either `ios` or `android` depending on the platform you want to use.


## Features

Product Catalogue: Display a list of 5,000 products with real-time stock availability (80% of products are in stock).
Pincode Input and Validation: Allow users to input a valid pincode and associate it with the appropriate logistics provider.
Delivery Date Estimation: Estimate the delivery date based on the selected product, pincode, and the associated logistics provider:

### Provider A: 
Same-day delivery for orders placed before 5 PM, provided the product is in stock.
### Provider B: 
Same-day delivery for orders placed before 9 AM; next-day delivery for orders placed after.
### General Partners: 
Delivery within 2 to 5 days depending on the pincode (metro, non-metro, or tier 2-3 cities).


### Countdown Timer: 
Implement a visible countdown timer for Provider A and Provider B orders to indicate the remaining time for qualifying for same-day delivery.
### 
Date and Time Awareness: Ensure the application accurately considers the current date and time to calculate delivery estimates.
### Responsive and User-Friendly UI: 
Provide a clean and intuitive user interface that adapts to different screen sizes and devices.
### Error Handling: 
Handle cases like invalid pincodes, products out of stock, and missing cutoff times for same-day delivery.
### Modular and Commented Code: 
Write clean, modular code with comments as needed for better maintainability and scalability.


## Application ScreenShots

Clinikally provides a range of features to streamline the healthcare experience. Here's a glimpse of the application's user interface:

### Home Screen
<img src="./ss1.png" alt="Screenshot 1" width="200" height="400" style="margin: 10px;">


### Product List Screen
<img src="./ss2.png" alt="Screenshot 1" width="200" height="400" style="margin: 10px;">

### Product Details Screen
<img src="./ss3.png" alt="Screenshot 1" width="200" height="400" style="margin: 10px;">

### Pincode testing
<img src="./ss4.png" alt="Screenshot 1" width="200" height="400" style="margin: 10px;">


## Hosting


## Getting timer and Date

We welcome contributions to the Clinikally project. If you'd like to get involved, please follow the guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

