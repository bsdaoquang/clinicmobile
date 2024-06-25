import Clipboard from "@react-native-clipboard/clipboard";
import { showToast } from "./showToast";

export const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export const handleCopyToClipboard = (text: string) => {
  Clipboard.setString(text);
  showToast('Đã copy vào bộ nhớ tạm');
};