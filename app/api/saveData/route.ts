// pages/api/saveData.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import path from 'path';

const saveDataToJsonFile = (filePath: string, newData: any) => {
  try {
    let currentData: any[] = [];

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      currentData = JSON.parse(fileContents);
    }

    // Append the new data
    currentData.push(newData);

    // Write updated data back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

    console.log('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Handler for the API route
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
export default function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("testing============================================================");

  try {
    const data = req.body;

    console.log('data', data)
  } catch (error) {
    console.log('error', error)
  }
  
  // if (req.method === 'POST') {
  //   const { newData } = req.body; // Extract new data from request body

  //   const filePath = path.join(process.cwd(), 'balanceHistory.json'); // Set the path to your JSON file

  //   // Call the save function
  //   saveDataToJsonFile(filePath, newData);

  //   // Respond with success
  //   res.status(200).json({ message: 'Data saved successfully!' });
  // } else {
  //   res.setHeader('Allow', ['POST']);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
