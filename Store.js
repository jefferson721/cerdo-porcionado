import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialProducts = [
  { id: 1, name: "Costilla de Cerdo", price: 12000, image: "/costilla.jpg", stock: 50 },
  { id: 2, name: "Lomo de Cerdo", price: 22000, image: "/lomo.jpg", stock: 30 },
  { id: 3, name: "Pernil de Cerdo", price: 16900, image: "/pernil.jpg", stock: 40 }
];

export default function Store() {
  const [products, setProducts] = useState(initialProducts);
  const [order, setOrder] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", notes: "" });

  const addToOrder = (product) => {
    if (product.stock > 0) {
      setOrder([...order, product]);
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
    }
  };

  const sendOrder = () => {
    const message = \`Pedido de: \${customer.name}%0AContacto: \${customer.phone}%0A%0A\${order.map(p => \`\${p.name} - $\${p.price}\`).join("%0A")}%0A%0ANotas: \${customer.notes}\`;
    window.open(\`https://wa.me/57TU_NUMERO?text=\${message}\`, "_blank");
  };

  const updateStock = (id, newStock) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Venta de Cerdo Porcionado</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <CardContent>
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-gray-600">${product.price} COP / lb</p>
              <p className="text-red-500">Disponibles: {product.stock} lb</p>
              <Button onClick={() => addToOrder(product)} className="mt-2 w-full" disabled={product.stock === 0}>
                {product.stock > 0 ? "Agregar" : "Agotado"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="p-4 border rounded-lg bg-white">
        <h2 className="text-lg font-bold">Tu Pedido</h2>
        {order.length === 0 ? <p>No has agregado productos</p> : (
          <ul>
            {order.map((item, index) => (
              <li key={index}>{item.name} - ${item.price} COP</li>
            ))}
          </ul>
        )}
        <Input placeholder="Tu Nombre" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="mt-2" />
        <Input placeholder="Tu Teléfono" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="mt-2" />
        <Textarea placeholder="Notas adicionales" value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} className="mt-2" />
        <Button onClick={sendOrder} className="mt-4 w-full">Enviar Pedido por WhatsApp</Button>
      </div>
      <div className="p-4 border rounded-lg bg-white mt-4">
        <h2 className="text-lg font-bold">Administrar Inventario</h2>
        {products.map((product) => (
          <div key={product.id} className="mt-2 flex justify-between items-center">
            <p>{product.name}:</p>
            <Input type="number" value={product.stock} onChange={(e) => updateStock(product.id, Number(e.target.value))} className="w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
