// Models for teaching AI: neural network, CNN, transformer, neuron vs artificial neuron, GPU, self-driving car, data center.
// Same group format as machines.js (G = label, colour, explode offset, stage, parts, { info }). Units are arbitrary, y up, viewer on +z.
import {
  line, polyline, quad, box, boxEdges, revolve, cylinder, ring, orient, tube, disc, torus, pipe, TAU,
} from '../lib/sampling.js';
import { linspace } from '../lib/vec.js';
import { vessel, blob, dots, capsule } from '../lib/shapes.js';
import { G, COL } from './engines.js';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
const slab = (c, size, d = 0.6) => box(c, size, d, 2);
const wires = (A, B, d = 0.5) => A.flatMap((a) => B.map((b) => line(a, b, 0, d)));
const quadYZ = (x, y, z, s, d = 1.2) => quad([x, y - s, z - s], [x, y + s, z - s], [x, y + s, z + s], [x, y - s, z + s], d);

// ============================================================ 1. NEURAL NETWORK (4 layers, data flows along +x)
function neuralNet() {
  const layer = (x, n) => Array.from({ length: n }, (_, i) => [x, (i - (n - 1) / 2) * 18, i % 2 ? 8 : -8]);
  const L = [layer(-90, 4), layer(-30, 6), layer(30, 6), layer(90, 3)];
  const pixels = [];
  for (const y of [-8, 0, 8]) for (const z of [-8, 0, 8]) pixels.push(quadYZ(-140, y, z, 3.5));
  const relu = (x) => [polyline([[x - 10, 62, 0], [x, 62, 0], [x + 10, 76, 0]], 0, 3), line([x - 12, 62, 0], [x + 12, 62, 0], 0, 1), line([x, 58, 0], [x, 80, 0], 0, 1)];
  const bars = L[3].map((p, i) => { const len = [34, 12, 6][i]; return box([112 + len / 2, p[1], p[2]], [len, 6, 6], 0.8, 2); });
  const back = [polyline([[90, -60, 0], [45, -80, 0], [-45, -80, 0], [-90, -60, 0]], 0, 3), line([-90, -60, 0], [-80, -56, 0], 0, 3), line([-90, -60, 0], [-84, -69, 0], 0, 3)];
  return [
    G('Input data (pixels)', COL.white, [-90, 0, 0], 0, pixels, { info: 'dữ liệu thô đưa vào, ví dụ các điểm ảnh của một bức ảnh' }),
    G('Input layer', COL.cyan, [-60, 0, 0], 0.05, dots(L[0], 3.4, 2), { info: 'mỗi nơ-ron nhận một giá trị của dữ liệu đầu vào' }),
    G('Hidden layer 1', COL.lime, [-20, 0, 0], 0.1, dots(L[1], 3.4, 2), { info: 'tìm các đặc trưng đơn giản như cạnh, góc' }),
    G('Hidden layer 2', COL.teal, [20, 0, 0], 0.15, dots(L[2], 3.4, 2), { info: 'ghép đặc trưng đơn giản thành đặc trưng phức tạp hơn' }),
    G('Output layer', COL.orange, [60, 0, 0], 0.2, dots(L[3], 3.8, 2), { info: 'mỗi nơ-ron đại diện một đáp án, ví dụ mèo, chó, chim' }),
    G('Weights (input to hidden 1)', COL.amber, [-40, 0, -75], 0.3, wires(L[0], L[1]), { info: 'mỗi đường là một trọng số: càng lớn thì tín hiệu càng mạnh' }),
    G('Weights (hidden 1 to 2)', COL.gold, [0, 0, -75], 0.3, wires(L[1], L[2]), { info: 'huấn luyện chính là chỉnh các trọng số này cho đúng' }),
    G('Weights (hidden 2 to output)', COL.amber, [40, 0, -75], 0.3, wires(L[2], L[3]), { info: 'trọng số quyết định mỗi đặc trưng ủng hộ đáp án nào' }),
    G('Activation function (ReLU)', COL.magenta, [0, 55, 0], 0.35, [relu(-30), relu(30)], { info: 'cắt giá trị âm về 0 để mạng học được quan hệ phi tuyến' }),
    G('Softmax probabilities', COL.green, [95, 0, 0], 0.25, bars, { info: 'biến đầu ra thành xác suất; cột dài nhất là dự đoán' }),
    G('Backpropagation (learning)', COL.red, [0, -55, 40], 0.4, back, { info: 'sai số chạy ngược về để mạng cập nhật trọng số và học' }),
  ];
}

// ============================================================ 2. CONVOLUTIONAL NEURAL NETWORK (image -> class)
function cnn() {
  const slabs = (x0, dx, n, s) => Array.from({ length: n }, (_, i) => slab([x0 + i * dx, 0, 0], [1.6, s, s], 0.5));
  const grid = [];
  for (const k of linspace(-25, 25, 6)) grid.push(line([-99, -25, k], [-99, 25, k], 0, 1.2), line([-99, k, -25], [-99, k, 25], 0, 1.2));
  const kernel = [box([-98, 16, 16], [2, 10, 10], 1, 3)];
  for (const [dy, dz] of [[-5, -5], [5, -5], [5, 5], [-5, 5]]) kernel.push(line([-98, 16 + dy, 16 + dz], [-56, 16, 16], 0, 1.5));
  const fc = linspace(-55, 55, 12).map((y) => [95, y, 0]);
  const out = [-20, 0, 20].map((y) => [135, y, 0]);
  return [
    G('Input image', COL.white, [-95, 0, 0], 0, [slab([-100, 0, 0], [2, 50, 50], 0.6), grid], { info: 'ảnh đầu vào là lưới các điểm ảnh, mỗi điểm là một con số' }),
    G('Kernel (3x3 filter)', COL.red, [-70, 45, 40], 0.1, kernel, { info: 'bộ lọc nhỏ trượt qua ảnh để tìm cạnh, góc, hoa văn' }),
    G('Feature maps (conv 1)', COL.cyan, [-45, 0, 0], 0.1, slabs(-56, 6, 4, 42), { info: 'mỗi tấm là kết quả của một bộ lọc: nơi nào có đặc trưng đó' }),
    G('Max pooling', COL.lime, [-15, 0, 0], 0.15, slabs(-10, 5, 4, 22), { info: 'thu nhỏ ảnh, giữ lại giá trị mạnh nhất để bớt tính toán' }),
    G('Feature maps (conv 2)', COL.teal, [15, 0, 0], 0.2, slabs(25, 5, 6, 16), { info: 'lớp sâu hơn nhận ra bộ phận phức tạp như mắt, tai, bánh xe' }),
    G('Flatten + fully connected', COL.amber, [50, 0, 0], 0.25, dots(fc, 3, 2), { info: 'trải phẳng đặc trưng thành một hàng số để ra quyết định' }),
    G('Connections to output', COL.gold, [60, 0, -70], 0.3, wires(fc, out, 0.5), { info: 'mỗi đường là một trọng số nối đặc trưng với đáp án' }),
    G('Output (softmax)', COL.orange, [85, 0, 0], 0.2, dots(out, 4, 2), { info: 'xác suất từng lớp, ví dụ mèo 92 %, chó 6 %, chim 2 %' }),
  ];
}

// ============================================================ 3. TRANSFORMER / LLM (stack along y: tokens at the bottom, next word on top)
function transformer() {
  const tx = linspace(-50, 50, 6);
  const tokens = tx.map((x) => box([x, -100, 0], [14, 8, 8], 1, 3));
  const arc = (a, b, h) => polyline(linspace(0, 1, 12).map((t) => [a + (b - a) * t, -35 + h * Math.sin(Math.PI * t), 0]), 0, 3);
  const attn = [arc(tx[0], tx[3], 22), arc(tx[1], tx[4], 18), arc(tx[2], tx[5], 22), arc(tx[0], tx[5], 32), arc(tx[1], tx[2], 8), arc(tx[3], tx[4], 8)];
  const wave = polyline(linspace(-50, 50, 40).map((x) => [x, -62 + 5 * Math.sin(x / 7), 0]), 0, 3);
  const mlp = [[-30, 4], [0, 6], [30, 4]].map(([x, n]) => linspace(-12, 12, n).map((y) => [x, 22 + y, 0]));
  const vocab = tx.map((x, i) => box([x, 72 + [20, 6, 3, 12, 4, 8][i] / 2, 0], [10, [20, 6, 3, 12, 4, 8][i], 8], 0.8, 2));
  return [
    G('Input tokens', COL.white, [0, -70, 0], 0, tokens, { info: 'câu được cắt thành các token: từ hoặc mảnh của từ' }),
    G('Embedding layer', COL.cyan, [0, -45, 0], 0.05, [slab([0, -82, 0], [110, 5, 30], 0.6), tx.map((x) => line([x, -96, 0], [x, -80, 0], 0, 2))], { info: 'đổi mỗi token thành một vector số biểu diễn ý nghĩa' }),
    G('Positional encoding', COL.lime, [0, -25, 40], 0.1, wave, { info: 'thêm thông tin vị trí để mô hình biết thứ tự các từ' }),
    G('Q, K, V projections', COL.magenta, [0, -5, 55], 0.15, [-40, 0, 40].map((x) => slab([x, -50, 0], [26, 4, 20], 0.8)), { info: 'mỗi token tạo ra Query, Key và Value để hỏi và trả lời nhau' }),
    G('Multi-head self-attention', COL.orange, [0, 15, 0], 0.2, attn, { info: 'mỗi từ nhìn các từ khác để biết từ nào quan trọng với nó' }),
    G('Add & layer norm', COL.silver, [0, 35, 0], 0.25, slab([0, -8, 0], [110, 3, 30], 0.7), { info: 'cộng đường tắt và chuẩn hóa để huấn luyện ổn định' }),
    G('Residual connection', COL.gold, [75, 15, 0], 0.3, [line([62, -82, 0], [62, -6, 0], 0, 2), line([62, -6, 0], [56, -6, 0], 0, 2)], { info: 'đường tắt giữ thông tin cũ đi thẳng lên các tầng trên' }),
    G('Feed-forward network', COL.teal, [0, 55, 0], 0.3, [mlp.map((l) => dots(l, 2.6, 2)), wires(mlp[0], mlp[1]), wires(mlp[1], mlp[2])], { info: 'mạng nơ-ron nhỏ xử lý riêng từng token sau attention' }),
    G('Transformer block (x N)', COL.ice, [95, 40, 0], 0.35, boxEdges([0, -8, 0], [120, 105, 36], 0, 2), { info: 'khối này lặp lại nhiều lần, ví dụ 12 đến 96 tầng' }),
    G('Output: linear + softmax', COL.green, [0, 80, 0], 0.2, [slab([0, 62, 0], [110, 4, 30], 0.7), vocab], { info: 'chấm điểm mọi từ trong từ điển, cột cao nhất là từ kế tiếp' }),
    G('Next token', COL.red, [0, 110, 0], 0.1, box([0, 105, 0], [18, 8, 8], 1.4, 3), { info: 'từ được chọn, đưa ngược vào đầu vào để viết từ tiếp theo' }),
  ];
}

// ============================================================ 4. BIOLOGICAL vs ARTIFICIAL NEURON (top = biology, bottom = machine, same flow left to right)
function neurons() {
  const yb = 50, ya = -50;
  const dendrites = [[-85, 60, 12], [-110, 78, 18], [-88, 32, 12], [-112, 22, 16], [-80, 52, -14], [-108, 62, -16]]
    .map(([x, y, z]) => vessel([[-62, yb, 0], [(x - 62) / 2 - 62, (y + yb) / 2, z / 2], [x, y, z]], 2.2, 0.7, 0.5));
  const myelin = [-34, -10, 14, 38].map((x) => capsule([x, yb, 0], [x + 14, yb, 0], 4.6, 0.6));
  const ends = [[78, 66, 8], [82, 50, 0], [78, 36, -8], [74, 56, -12]];
  const terminals = ends.map((e) => vessel([[62, yb, 0], [(62 + e[0]) / 2, (yb + e[1]) / 2, e[2] / 2], e], 1.4, 1, 0.6));
  const bulbs = ends.map((e) => [e[0] + 3, e[1], e[2]]);
  const ins = [[-110, -30, 0], [-110, -50, 0], [-110, -70, 0]], sum = [-30, ya, 0];
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0];
  const sigmoid = polyline(linspace(-1, 1, 20).map((t) => [20 + t * 18, ya + 12 / (1 + Math.exp(-5 * t)) - 6, 0]), 0, 3);
  return [
    G('Dendrites / inputs x', COL.cyan, [-60, 30, 0], 0, [dendrites, dots(ins, 3.2, 2)], { info: 'sợi nhánh nhận tín hiệu; ở nơ-ron nhân tạo là các giá trị đầu vào' }),
    G('Synapse strength / weights w', COL.amber, [-30, -20, 50], 0.1, [ins.map((p) => [line(p, sum, 0, 1), box(mid(p, sum), [6, 6, 6], 0.8, 2)])], { info: 'độ mạnh của khớp nối; ở máy là trọng số nhân với từng đầu vào' }),
    G('Cell body (soma) / sum', COL.pink, [0, 30, 40], 0.15, [blob([-55, yb, 0], [14, 12, 12], { density: 0.5 }), blob(sum, [12, 12, 12], { density: 0.5 }), dots([[-30, ya, 0]], 4, 3)], { info: 'thân tế bào gom mọi tín hiệu; ở máy là phép cộng có trọng số' }),
    G('Nucleus', COL.purple, [0, 70, 0], 0.2, blob([-55, yb, 0], [6, 6, 6], { density: 1.2 }), { info: 'nhân chứa DNA, điều khiển hoạt động của tế bào' }),
    G('Axon', COL.teal, [0, 30, -30], 0.2, vessel([[-42, yb, 0], [0, yb, 0], [62, yb, 0]], 1.8, 1.8, 0.7), { info: 'sợi trục dẫn xung điện đi xa tới các nơ-ron khác' }),
    G('Myelin sheath', COL.white, [0, 55, 40], 0.25, myelin, { info: 'bao myelin cách điện giúp xung truyền nhanh tới 100 m/s' }),
    G('Axon terminals / output y', COL.orange, [50, 30, 0], 0.3, [terminals, dots(bulbs, 3, 2), line([sum[0] + 12, ya, 0], [90, ya, 0], 0, 2), dots([[93, ya, 0]], 3.6, 3)], { info: 'đầu sợi trục truyền tín hiệu sang tế bào kế; ở máy là đầu ra y' }),
    G('Activation function', COL.magenta, [30, -35, 0], 0.3, [sigmoid, line([2, ya - 8, 0], [38, ya - 8, 0], 0, 1), line([20, ya - 12, 0], [20, ya + 12, 0], 0, 1)], { info: 'quyết định nơ-ron có phát tín hiệu hay không (đường cong sigmoid)' }),
  ];
}

// ============================================================ 5. AI GPU CHIP (package seen from the side, layers stack along y)
function gpu() {
  const cores = [], tensor = [];
  for (const i of linspace(-25, 25, 6)) for (const j of linspace(-25, 25, 6)) if (Math.abs(i) > 8 || Math.abs(j) > 8) cores.push(box([i, -7, j], [7, 3, 7], 0.35, 2));
  for (const i of [-5, 5]) for (const j of [-5, 5]) tensor.push(box([i, -7, j], [8, 4, 8], 0.5, 2));
  const hbm = (x) => [0, 1, 2, 3].map((k) => slab([x, -13 + k * 2.5, 0], [16, 1.6, 34], 0.4));
  const bga = linspace(-65, 65, 12).flatMap((x) => linspace(-65, 65, 12).map((z) => [x, -28, z]));
  const fins = linspace(-48, 48, 12).map((x) => box([x, 24, 0], [1.5, 26, 100], 0.2, 2));
  const blades = Array.from({ length: 7 }, (_, k) => { const a = (k / 7) * TAU; return line([0, 52, 0], [30 * Math.cos(a + 0.6), 52, 30 * Math.sin(a + 0.6)], 0, 3); });
  const vrm = [];
  for (const x of [-62, 62]) for (const z of [-62, 62]) vrm.push(box([x, -18, z], [14, 9, 14], 1, 3), torus([x, -11, z], 4, 1.2, Y, 2));
  return [
    G('Package substrate (PCB)', COL.green, [0, -75, 0], 0, slab([0, -24, 0], [150, 5, 150], 0.4), { info: 'bo mạch của gói chip, dẫn điện và tín hiệu ra ngoài' }),
    G('Solder balls (BGA)', COL.silver, [0, -105, 0], 0.05, dots(bga, 1.2, 1.5), { info: 'hàng trăm bi hàn nối chip với bo mạch chủ' }),
    G('Interposer', COL.teal, [0, -50, 0], 0.1, slab([0, -17, 0], [120, 2, 110], 0.5), { info: 'tấm silicon nối GPU với bộ nhớ bằng hàng nghìn đường dây ngắn' }),
    G('Silicon die', COL.cyan, [0, -25, 0], 0.15, slab([0, -12, 0], [70, 4, 70], 0.3), { info: 'lõi chip: hàng chục tỷ bóng bán dẫn trên một mảnh silicon' }),
    G('CUDA cores', COL.lime, [0, 8, 0], 0.2, cores, { info: 'hàng nghìn lõi nhỏ tính song song, hợp với việc nhân ma trận' }),
    G('Tensor cores', COL.orange, [0, 40, 0], 0.25, tensor, { info: 'lõi chuyên nhân ma trận cho AI, nhanh hơn lõi thường nhiều lần' }),
    G('L2 cache', COL.amber, [0, 20, 75], 0.3, [slab([0, -8, 32], [60, 2.5, 5], 1), slab([0, -8, -32], [60, 2.5, 5], 1)], { info: 'bộ nhớ đệm nhỏ nhưng rất nhanh, nằm sát lõi tính toán' }),
    G('HBM memory', COL.purple, [75, 10, 0], 0.2, hbm(52), { info: 'bộ nhớ băng thông cao xếp chồng, chứa trọng số của mô hình' }),
    G('HBM memory (L)', COL.purple, [-75, 10, 0], 0.2, hbm(-52), { showLabel: false }),
    G('Voltage regulators (VRM)', COL.gold, [0, -30, 100], 0.3, vrm, { info: 'hạ điện áp xuống mức chip cần, cấp hàng trăm ampe' }),
    G('Heat spreader (lid)', COL.silver, [0, 55, 0], 0.15, slab([0, 6, 0], [100, 2, 100], 0.25), { info: 'nắp kim loại dàn đều nhiệt từ chip ra ngoài' }),
    G('Heat sink fins', COL.ice, [0, 90, 0], 0.2, fins, { info: 'các lá tản nhiệt tăng diện tích để thải nhiệt ra không khí' }),
    G('Cooling fan', COL.teal, [0, 130, 0], 0.25, [ring([0, 52, 0], 30, { density: 3 }), disc([0, 52, 0], 0, 5, Y, 2), blades], { info: 'quạt thổi gió qua lá tản nhiệt để chip không quá nóng' }),
  ];
}

// ============================================================ 6. SELF-DRIVING CAR (x forward, cm)
function selfDrivingCar() {
  const wheels = (s) => [-140, 140].flatMap((x) => [torus([x, 25, s * 95], 25, 8, Z, 0.7), disc([x, 25, s * 95], 0, 12, Z, 0.5)]);
  const cams = [[105, 98, 0], [-125, 98, 0], [50, 90, 82], [50, 90, -82], [-60, 90, 82], [-60, 90, -82]].map(([x, y, z]) => box([x, y, z], [8, 6, 8], 1.2, 3));
  const radar = [[222, 38, 0], [210, 38, 70], [210, 38, -70], [-222, 38, 0], [-210, 38, 70], [-210, 38, -70]].map(([x, y, z]) => box([x, y, z], [6, 10, 24], 1, 3));
  const sonar = [...linspace(-70, 70, 6).map((z) => [226, 28, z]), ...linspace(-70, 70, 6).map((z) => [-226, 28, z])];
  const cone = (x0, len, half) => [line([x0, 40, 0], [x0 + len, 40, half], 0, 2), line([x0, 40, 0], [x0 + len, 40, -half], 0, 2), polyline(linspace(-1, 1, 12).map((t) => [x0 + len, 40, half * t]), 0, 2)];
  const comp = [box([-130, 35, 0], [44, 12, 36], 1.2, 3), ring([-130, 42, 0], 12, { density: 4 }), ...linspace(-14, 14, 5).map((z) => line([-146, 41, z], [-114, 41, z], 0, 2))];
  const grid = linspace(-80, 80, 6).map((x) => line([x, 22.5, -55], [x, 22.5, 55], 0, 1.5));
  const spokes = Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * TAU; return line([14 * Math.cos(a), 128, 14 * Math.sin(a)], [95 * Math.cos(a), 128, 95 * Math.sin(a)], 0, 1.2); });
  return [
    G('Body shell', COL.steel, [0, 70, 0], 0, [blob([0, 52, 0], [220, 26, 88], { density: 0.15 }), blob([-15, 92, 0], [105, 26, 72], { density: 0.15 })], { info: 'vỏ xe che chắn, sensor được gắn khéo trên đó' }),
    G('Chassis & battery', COL.green, [0, -70, 0], 0.05, [slab([0, 18, 0], [260, 10, 150], 0.5), slab([0, 14, 0], [200, 6, 120], 0.6), grid], { info: 'khung xe kèm pin nằm sát sàn để xe thấp và vững' }),
    G('Wheels', COL.white, [0, -15, 95], 0.1, wheels(1), { info: 'bánh xe có cảm biến tốc độ để tính quãng đường đã đi' }),
    G('Wheels (L)', COL.white, [0, -15, -95], 0.1, wheels(-1), { showLabel: false }),
    G('Electric motor & axle', COL.orange, [0, -60, 0], 0.2, [tube([140, 25, -60], [140, 25, 60], 9, 9, 1.4), tube([-140, 25, -60], [-140, 25, 60], 9, 9, 1.4), cylinder([140, 25, 0], 16, 28, { density: 0.8 })], { info: 'động cơ điện truyền lực xuống bánh theo lệnh của máy tính' }),
    G('Lidar', COL.magenta, [0, 95, 0], 0.2, [cylinder([0, 118, 0], 14, 12, { cap: true, density: 1 }), ring([0, 131, 0], 14, { density: 5 })], { info: 'quay liên tục, bắn tia laser để đo khoảng cách ra bản đồ 3D' }),
    G('Lidar scan field', COL.red, [0, 125, 0], 0.25, [ring([0, 128, 0], 95, { density: 2 }), spokes], { info: 'vùng xung quanh xe mà lidar quét, tạo đám mây điểm 3D' }),
    G('Cameras', COL.cyan, [30, 45, 0], 0.15, cams, { info: 'đọc biển báo, vạch kẻ đường, đèn giao thông và người đi bộ' }),
    G('Radar', COL.lime, [70, 0, 0], 0.2, radar, { info: 'sóng vô tuyến đo vận tốc của xe khác, hoạt động cả khi sương mù' }),
    G('Ultrasonic sensors', COL.amber, [0, -30, 110], 0.25, dots(sonar, 3, 2), { info: 'siêu âm đo vật cản gần, dùng khi đỗ xe hoặc đi chậm' }),
    G('GPS & 5G antenna', COL.gold, [-60, 70, 0], 0.15, [tube([-60, 124, 0], [-80, 134, 0], 5, 2, 1.5), torus([-70, 129, 0], 4, 0.8, Y, 2)], { info: 'định vị chính xác và nhận bản đồ, giao thông qua mạng' }),
    G('AI computer', COL.pink, [-90, 40, -60], 0.3, comp, { info: 'bộ não: chạy mạng nơ-ron hợp nhất mọi cảm biến để quyết định lái' }),
    G('Sensor field of view', COL.purple, [110, 0, 0], 0.35, [cone(225, 200, 90), cone(105, 330, 45)], { info: 'vùng nhìn của radar và camera, chồng lên nhau để kiểm tra chéo' }),
  ];
}

// ============================================================ 7. AI DATA CENTER (metres, aerial view)
function dataCenter() {
  const xs = linspace(-87, 87, 8);
  const rackRow = (z) => xs.map((x) => box([x, 18, z], [14, 36, 20], 0.35, 2));
  const leds = (z) => dots(xs.flatMap((x) => linspace(6, 30, 5).map((y) => [x, y, z + 10.3])), 0.9, 2);
  const cables = [-40, 0, 40].flatMap((z) => [line([-95, 46, z], [95, 46, z], 0, 3), ...xs.map((x) => line([x, 46, z], [x, 36, z], 0, 3))]);
  const cooling = (x) => [box([x, 18, 0], [16, 36, 60], 0.5, 2), orient(ring([0, 0, 0], 13, { density: 4 }), X, [x - Math.sign(x) * 8.5, 18, 15]), orient(ring([0, 0, 0], 13, { density: 4 }), X, [x - Math.sign(x) * 8.5, 18, -15])];
  const ups = [-20, 0, 20].map((x) => box([x, 12, 130], [14, 24, 20], 0.5, 2));
  const gens = [-170, -150].map((z) => orient(cylinder([0, 0, 0], 9, 40, { density: 0.8, cap: true }), X, [-190, 10, z]));
  const towers = [-90, 0, 90].flatMap((x) => [cylinder([x, 0, -135], 16, 30, { density: 0.7 }), ring([x, 30, -135], 16, { density: 4 }), ring([x, 30, -135], 8, { density: 3 })]);
  return [
    G('Building shell', COL.ice, [0, 90, 0], 0, boxEdges([0, 40, 0], [300, 80, 200], 0, 1.5), { info: 'tòa nhà kín, an ninh nghiêm ngặt, đặt gần nguồn điện và nước' }),
    G('Raised floor', COL.silver, [0, -70, 0], 0.05, slab([0, 0, 0], [300, 3, 200], 0.25), { info: 'sàn nâng, bên dưới đi dây điện và dẫn gió lạnh lên tủ máy' }),
    G('Server racks (row A)', COL.cyan, [0, 0, -65], 0.1, [rackRow(-40), leds(-40)], { info: 'mỗi tủ chứa các máy chủ GPU huấn luyện và chạy mô hình AI' }),
    G('Server racks (row B)', COL.teal, [0, 50, 0], 0.15, [rackRow(0), leds(0)], { info: 'hàng tủ ở giữa, mật độ điện lên tới hàng chục kW mỗi tủ' }),
    G('Server racks (row C)', COL.lime, [0, 0, 65], 0.1, [rackRow(40), leds(40)], { info: 'đèn LED báo hoạt động, hàng nghìn GPU cùng làm việc' }),
    G('Fiber optic network', COL.magenta, [0, 100, 0], 0.25, cables, { info: 'cáp quang nối các tủ để GPU trao đổi dữ liệu với tốc độ rất cao' }),
    G('Cooling units (CRAC)', COL.purple, [75, 0, 0], 0.2, cooling(140), { info: 'thổi gió lạnh qua tủ máy để lấy nhiệt đi' }),
    G('Cooling units (L)', COL.purple, [-75, 0, 0], 0.2, cooling(-140), { showLabel: false }),
    G('Chilled water pipes', COL.cyan, [0, -35, 0], 0.3, pipe([[-130, -3, -85], [130, -3, -85], [130, -3, 85], [-130, -3, 85], [-130, -3, -85]], 2, 1.2), { info: 'đường ống nước lạnh mang nhiệt ra tháp giải nhiệt' }),
    G('Transformer & UPS batteries', COL.amber, [0, 0, 70], 0.3, ups, { info: 'biến áp và pin lưu điện giữ máy chạy khi mất điện lưới' }),
    G('Backup generators', COL.orange, [-60, 0, 0], 0.35, gens, { info: 'máy phát điện diesel khởi động khi mất điện kéo dài' }),
    G('Cooling towers', COL.white, [0, 0, -70], 0.3, towers, { info: 'tháp giải nhiệt thải nhiệt ra môi trường bằng bay hơi nước' }),
  ];
}

export const AI = [
  { name: 'Neural Network', fit: 1.0, groups: neuralNet, color: [0.4, 0.85, 1.0], tilt: 10, viewYaw: 0.45, fact: '4 lớp · 78 trọng số · học bằng lan truyền ngược' },
  { name: 'Convolutional Neural Network', fit: 1.0, groups: cnn, color: [0.45, 1.0, 0.8], tilt: 10, viewYaw: 0.5, fact: 'ảnh → bộ lọc → pooling → kết nối đầy đủ → nhãn' },
  { name: 'Transformer (LLM)', groups: transformer, color: [1.0, 0.65, 0.3], tilt: 8, viewYaw: 0.5, fact: 'attention · lặp nhiều tầng · đoán từ kế tiếp' },
  { name: 'Biological vs Artificial Neuron', fit: 1.0, groups: neurons, color: [1.0, 0.5, 0.8], tilt: 10, viewYaw: 0.4, fact: 'trên: nơ-ron thật · dưới: nơ-ron nhân tạo' },
  { name: 'AI GPU Chip', groups: gpu, color: [0.5, 1.0, 0.45], tilt: 22, viewYaw: 0.5, fact: 'hàng chục tỷ bóng bán dẫn · lõi tensor · bộ nhớ HBM' },
  { name: 'Self-driving Car', groups: selfDrivingCar, color: [0.45, 0.7, 1.0], tilt: 16, viewYaw: 0.75, fact: 'lidar · radar · camera · máy tính AI' },
  { name: 'AI Data Center', groups: dataCenter, color: [0.6, 0.85, 1.0], tilt: 35, viewYaw: 0.6, fact: 'hàng nghìn GPU · làm mát · điện dự phòng' },
];
