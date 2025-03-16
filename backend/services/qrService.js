// services/qrService.js
const QRCode = require('qrcode');

/**
 * Generate a QR code as a data URL.
 * @param {string} data Data to encode in the QR code.
 * @returns {Promise<string>} A promise that resolves with the data URL.
 */
async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

module.exports = { generateQRCode };
