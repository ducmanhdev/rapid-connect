const fallbackCopyTextToClipboard = (text: string) => {
  return new Promise<void>((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('Unable to copy');
      }
      resolve();
    } catch (error: any) {
      reject(`Fallback: ${error?.message}`);
    }
    document.body.removeChild(textArea);
  });
};

const copyTextToClipboard = (text: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (!navigator.clipboard) {
        await fallbackCopyTextToClipboard(text);
      } else {
        await navigator.clipboard.writeText(text);
      }
      resolve('Copied!');
    } catch (error: any) {
      reject(`Could not copy text: ${error?.message}`);
    }
  });
};

export default copyTextToClipboard;
