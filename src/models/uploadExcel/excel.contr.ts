import { Request, Response } from 'express';
// import excelModel from './excel.model.js';
import handleError from '../../utils/catchError.js';
import { UploadedFile } from 'express-fileupload';
import xlsx from "xlsx";
class ControlModel {
  async CreateFile(req: Request, res: Response) {
    try {
      const uploadedFile = req.files?.file as UploadedFile;
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
      }     // Check if an uploaded file exists
      if (!uploadedFile) {
        return res.status(400).json({ error: 'Fayl yuklanmagan' });
      }
      const fileDataBuffer: Buffer = uploadedFile.data;
      const workbook = xlsx.read(fileDataBuffer, { type: 'buffer' });
      // Assuming 'Sheet1' is the sheet name
      const sheets = workbook.Sheets['Лист1'];
      const rawData = extractData(sheets);
      const result = formatData(rawData);
      res.send(result);
      // formattedData.map(async item => {
      //     let creatModel = new excelModel({ name: item.name, type: item.type, date: item.date });
      //     await creatModel.save();
      // })
    } catch (error: any) {
      return handleError(res, error)
    }
  }
}
function extractData(data: any) {
  const sheetData: any = {};
  const rowCount: any = parseInt(data['!ref'].split(':')[1].match(/\d+/)[0]);
  const columnKeys: string[] = []; // Barcha ustunlar ro'yxati

  // Barcha ustunlarni aniqlash
  for (const key in data) {
    if (key !== '!ref' && key !== '!margins') {
      const column = key.charAt(0); // Ustunning harfi
      if (!columnKeys.includes(column)) {
        columnKeys.push(column);
      }
    }
  }
  for (let i = 1; i <= rowCount; i++) {
    const phoneKey = `A${i}`;
    const messages = [];

    for (const columnKey of columnKeys) {
      const cell = data[`${columnKey}${i}`];
      if (cell && cell.v && cell.t == "s") {
        messages.push(cell.v);
      }
    }
    const phoneCell = data[phoneKey];
    if (phoneCell && phoneCell.v) {
      const phone = parseFloat(phoneCell.v);
      sheetData[phone] = messages;
    }
  }

  return sheetData;
}

function formatData(data: any) {
  const formattedData = [];

  for (const phone in data) {
    formattedData.push({
      phone: phone,
      text: data[phone],
    });
  }

  return formattedData;
}
export default ControlModel;