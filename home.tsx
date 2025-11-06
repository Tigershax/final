import { useEffect, useState } from "react"; // นำเข้า hook useEffect และ useState จาก React เพื่อใช้จัดการสถานะและผลข้างเคียง

// กำหนด type หรือโครงสร้างของข้อมูลมอเตอร์ไซค์
type Motorcycle = {
  id?: string; // id เป็น optional (อาจมีหรือไม่มีก็ได้)
  motorcycleName: string; // ชื่อรุ่นของมอเตอร์ไซค์
  motorcycleBrand: string; // ยี่ห้อของมอเตอร์ไซค์
  motorcyclePrice: number; // ราคาของมอเตอร์ไซค์
  motorcycleAvailable: boolean; // สถานะว่ามีสินค้าหรือไม่
  motorcycleImage: string; // URL รูปภาพของมอเตอร์ไซค์
};

export default function Home() { // ประกาศ component หลักชื่อ Home
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]); // สร้าง state สำหรับเก็บรายการมอเตอร์ไซค์ทั้งหมด
  const [form, setForm] = useState<Motorcycle>({ // สร้าง state สำหรับเก็บค่าฟอร์มที่ใช้เพิ่มหรือแก้ไขข้อมูล
    motorcycleName: "",
    motorcycleBrand: "",
    motorcyclePrice: 0,
    motorcycleAvailable: true,
    motorcycleImage: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null); // state สำหรับเก็บ id ของมอเตอร์ไซค์ที่กำลังแก้ไข (ถ้ามี)

  // ฟังก์ชันโหลดข้อมูลจาก backend
  const fetchMotorcycles = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/motorcycles"); // ดึงข้อมูลจาก API
      if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ"); // ถ้า fetch ไม่สำเร็จให้โยน error
      const data = await res.json(); // แปลงข้อมูล JSON ที่ได้จาก API
      setMotorcycles(data); // เก็บข้อมูลใน state motorcycles
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error); // แสดง error ถ้ามี
    }
  };

  useEffect(() => { // useEffect ทำงานตอน component ถูก mount
    fetchMotorcycles(); // เรียกโหลดข้อมูลจาก API ทันที
  }, []); // [] หมายถึงให้ทำงานแค่ครั้งแรกตอนโหลดหน้า

  // ฟังก์ชันสำหรับจัดการตอนกด submit ฟอร์ม (เพิ่มหรือแก้ไข)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเว็บ

    const method = editingId ? "PUT" : "POST"; // ถ้ามี editingId แสดงว่าแก้ไข ใช้ PUT ถ้าไม่มี ใช้ POST
    const url = editingId
      ? `http://localhost:3001/api/motorcycles/${editingId}` // URL สำหรับแก้ไข
      : "http://localhost:3001/api/motorcycles"; // URL สำหรับเพิ่มใหม่

    await fetch(url, {
      method, // ส่ง method ที่เลือก (PUT หรือ POST)
      headers: { "Content-Type": "application/json" }, // ตั้งค่า header ให้ส่งข้อมูลแบบ JSON
      body: JSON.stringify(form), // แปลงข้อมูลในฟอร์มเป็น JSON เพื่อส่งไป backend
    });

    setForm({ // เคลียร์ค่าฟอร์มหลังบันทึกเสร็จ
      motorcycleName: "",
      motorcycleBrand: "",
      motorcyclePrice: 0,
      motorcycleAvailable: true,
      motorcycleImage: "",
    });
    setEditingId(null); // เคลียร์สถานะแก้ไข
    fetchMotorcycles(); // โหลดข้อมูลใหม่จาก API เพื่ออัปเดตหน้า
  };

  // ฟังก์ชันสำหรับตั้งค่าฟอร์มให้พร้อมแก้ไขข้อมูล
  const handleEdit = (item: Motorcycle) => {
    setForm(item); // ใส่ค่าที่เลือกลงในฟอร์ม
    setEditingId(item.id || null); // เก็บ id ของรายการที่กำลังแก้ไข
  };

  // ฟังก์ชันสำหรับลบข้อมูล
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3001/api/motorcycles/${id}`, {
      method: "DELETE", // เรียก API ลบข้อมูลโดยใช้ DELETE
    });
    fetchMotorcycles(); // โหลดข้อมูลใหม่หลังจากลบเสร็จ
  };

  // ส่วนที่แสดงผลบนหน้าเว็บ
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 p-6"> {/* พื้นหลังไล่สีและระยะขอบ */}
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600"> {/* หัวข้อหลักของหน้า */}
        ระบบจัดการมอเตอร์ไซค์ 🏍️
      </h1>

      {/* ฟอร์มเพิ่มหรือแก้ไขข้อมูล */}
      <form
        onSubmit={handleSubmit} // เรียก handleSubmit เมื่อกดปุ่ม
        className="max-w-md mx-auto bg-white p-4 rounded shadow" // สไตล์กล่องฟอร์ม
      >
        <input
          type="text"
          placeholder="ชื่อรุ่น"
          value={form.motorcycleName} // ผูกค่ากับ state form
          onChange={(e) =>
            setForm({ ...form, motorcycleName: e.target.value }) // อัปเดตค่าใน form เมื่อพิมพ์
          }
          className="w-full border p-2 mb-2 rounded text-gray-800 placeholder-gray-500"
          required // บังคับกรอก
        />

        <input
          type="text"
          placeholder="ยี่ห้อ"
          value={form.motorcycleBrand}
          onChange={(e) =>
            setForm({ ...form, motorcycleBrand: e.target.value })
          }
          className="w-full border p-2 mb-2 rounded text-gray-800 placeholder-gray-500"
          required
        />

        <input
          type="number"
          placeholder="ราคา"
          value={form.motorcyclePrice}
          onChange={(e) =>
            setForm({ ...form, motorcyclePrice: Number(e.target.value) }) // แปลงค่าที่กรอกเป็น number
          }
          className="w-full border p-2 mb-2 rounded text-gray-800 placeholder-gray-500"
          required
        />

        <input
          type="text"
          placeholder="URL รูปภาพ"
          value={form.motorcycleImage}
          onChange={(e) =>
            setForm({ ...form, motorcycleImage: e.target.value })
          }
          className="w-full border p-2 mb-2 rounded text-gray-800 placeholder-gray-500"
        />

        <label className="flex items-center gap-2 mb-2 text-gray-800">
          <input
            type="checkbox"
            checked={form.motorcycleAvailable}
            onChange={(e) =>
              setForm({ ...form, motorcycleAvailable: e.target.checked }) // เปลี่ยนค่าตาม checkbox
            }
          />
          มีสินค้าพร้อมจำหน่าย
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          {editingId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"} {/* เปลี่ยนข้อความปุ่มตามโหมด */}
        </button>
      </form>

      {/* ส่วนแสดงรายการมอเตอร์ไซค์ */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          รายการมอเตอร์ไซค์
        </h2>

        {motorcycles.length === 0 ? ( // ตรวจสอบว่ามีข้อมูลไหม
          <p className="text-center text-gray-600">
            ยังไม่มีข้อมูลมอเตอร์ไซค์ {/* แสดงข้อความถ้าไม่มีข้อมูล */}
          </p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4"> {/* จัดเรียงข้อมูลเป็นกริด */}
            {motorcycles.map((item) => ( // วนลูปแสดงมอเตอร์ไซค์แต่ละรายการ
              <div
                key={item.id} // กำหนด key สำหรับแต่ละรายการ
                className="bg-white shadow rounded p-4 text-center" // กล่องข้อมูลแต่ละชิ้น
              >
                <img
                  src={item.motorcycleImage} // แสดงรูปภาพจาก URL
                  alt={item.motorcycleName}
                  className="w-full h-40 object-cover rounded mb-3" // ตั้งขนาดรูปภาพ
                />
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.motorcycleName} {/* แสดงชื่อรุ่น */}
                </h3>
                <p className="text-gray-600">{item.motorcycleBrand}</p> {/* แสดงยี่ห้อ */}
                <p className="text-blue-600 font-semibold mt-1">
                  {item.motorcyclePrice.toLocaleString()} บาท {/* แสดงราคาแบบมีจุลภาค */}
                </p>
                <p
                  className={`mt-1 ${
                    item.motorcycleAvailable
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.motorcycleAvailable ? "พร้อมจำหน่าย" : "หมด"} {/* แสดงสถานะ */}
                </p>

                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(item)} // เมื่อกดให้โหลดข้อมูลไปใส่ในฟอร์มเพื่อแก้ไข
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => item.id && handleDelete(item.id)} // เมื่อกดให้ลบข้อมูลตาม id
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
