export const generateCode = (value) => {
    let output = '';
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // đến đây là bỏ được dấu
        .split(' ')
        .forEach((item) => {
            output += item.charAt(1) + item.charAt(0);
        }); // tách thành mảng các từ k dấu (bỏ dấu cách) rồi lấy 2 kí tự đầu (đảo thứ tự) mỗi từ làm output => custom encode => có thể dùng reduce cũng được
    return output.toUpperCase() + value.length; // output viết hoa kèm length ở cuối
    // VD: Xin chào Việt Nam => IXHCIVAN17 (IX + HC + IV + AN + 17)
};
