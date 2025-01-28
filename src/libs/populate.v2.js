import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

// Cargar las variables de entorno
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    process.exit(1); // Salir si no se puede conectar
  }
};

const populateDatabase = async () => {
  try {
    // Limpiar las colecciones
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Colecciones limpiadas.");

    // Crear categorías de prueba
    const categories = [
      {
        "nombre": "Lácteos",
        "descripcion": "Productos derivados de la leche como quesos, yogures, mantequillas, entre otros.",
        "imagen": "https://www.webconsultas.com/sites/default/files/styles/wch_image_schema/public/media/0d/articulos/productos-lacteos.jpg"
      },
      {
        "nombre": "Aceites",
        "descripcion": "Aceites vegetales como oliva, girasol, canola y otros utilizados en la cocina.",
        "imagen": "https://cuidateplus.marca.com/sites/default/files/styles/natural/public/cms/2023-05/aceiteolivagirasol.jpg.webp?itok=Wydkrrys"
      },
      {
        "nombre": "Bebidas",
        "descripcion": "Bebidas refrescantes como jugos, refrescos, agua mineral y bebidas alcohólicas.",
        "imagen": "https://www.zarla.com/images/zarla-logos-para-bebidas-energizantes-4589x3446-20230321.jpeg?crop=16:9,smart&width=1200&dpr=2"
      },
      {
        "nombre": "Embutidos",
        "descripcion": "Productos cárnicos procesados como chorizos, jamones, salchichones, etc.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZUGAcNZhtdXyJy8zECflpP76d_oB2dNEE_w&s"
      },
      {
        "nombre": "Congelados",
        "descripcion": "Productos alimenticios congelados como vegetales, carnes, pizzas, etc.",
        "imagen": "https://congeladosdil.com/dynamic/img/alimentos-congelador3.jpeg"
      }
    ];
    const categoriesDB = [];
    for (let i = 0; i < categories.length; i++) {
      const category = new Category({
        name: categories[i].nombre,
        description: categories[i].descripcion,
        image: categories[i].imagen,
      });
      await category.save();
      categoriesDB.push(category);
    }
    console.log("Categorías creadas.");

    // Crear productos de prueba
    const products = [
      {
        "nombre": "Leche Fresca Natural",

        "precio": 1.20,
        "descripcion": "Leche fresca de vaca, ideal para toda la familia.",
        "imagen": "https://img.freepik.com/fotos-premium/vaso-leche-fresca-natural-sobre-mesa-vista-al-paisaje-granja-campo-verde-cabra_641010-24571.jpg",
        "stock": 5,
        "tags": ["leche", "vaca", "natural"]
      },
      {
        "nombre": "Yogurt Griego Natural",

        "precio": 1.50,
        "descripcion": "Yogurt griego natural, cremoso y sin azúcares añadidos.",
        "imagen": "https://plazavea.vteximg.com.br/arquivos/ids/22976323/20326289.jpg?v=638059744473070000",
        "stock": 9,
        "tags": ["yogurt", "cremoso", "natural"]
      },
      {
        "nombre": "Queso Cottage",

        "precio": 2.30,
        "descripcion": "Queso cottage bajo en grasa, ideal para dietas.",
        "imagen": "https://image.tuasaude.com/media/article/mq/kh/queso-cottage_62896_l.jpg",
        "stock": 7,
        "tags": ["queso", "cottage", "dieta"]
      },
      {
        "nombre": "Mantequilla Clarificada",

        "precio": 2.10,
        "descripcion": "Mantequilla clarificada, perfecta para cocinar y freír.",
        "imagen": "https://www.conasi.eu/blog/wp-content/uploads/2024/06/ghee-d.png",
        "stock": 4,
        "tags": ["matequilla", "cocina", "vaca"]
      },
      {
        "nombre": "Leche de Soja Orgánica",

        "precio": 2.50,
        "descripcion": "Leche de soja sin lactosa, ideal para veganos.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJuQnwL6XgpuaC9OqFTd5JJB5haAHbv_73bA&s",
        "stock": 20,
        "tags": ["leche", "soja", "vegano", "organico"]
      },
      {
        "nombre": "Queso Cheddar Maduro",

        "precio": 3.00,
        "descripcion": "Queso cheddar curado, con sabor fuerte y sabroso.",
        "imagen": "https://www.lacasadelqueso.com.ar/wp-content/uploads/2017/07/queso-cheddar-corte-horma.jpg",
        "stock": 9,
        "tags": ["queso", "cheddar", "vaca"]
      },
      {
        "nombre": "Crema de Leche",

        "precio": 1.80,
        "descripcion": "Crema de leche espesa, perfecta para salsas y postres.",
        "imagen": "https://www.nestleprofessional-latam.com/sites/default/files/styles/np_product_detail/public/2024-02/NESTLE-Crema-de-leche-300g.jpg?itok=Sohc57rm",
        "stock": 12,
        "tags": ["crema", "cremoso", "postres", "leche"]
      },
      {
        "nombre": "Leche en Polvo",

        "precio": 2.70,
        "descripcion": "Leche en polvo de alta calidad, fácil de disolver.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrtrne_b9QYzKCGXy-76wwj6DzyGYEvRNpkw&s",
        "stock": 6,
        "tags": ["leche", "polvo", "vaca"]
      },

      // aceites 
      {
        "nombre": "Aceite de Oliva Extra Virgen",

        "precio": 4.80,
        "descripcion": "Aceite de oliva extra virgen de primera prensada, ideal para ensaladas.",
        "imagen": "https://s.yimg.com/ny/api/res/1.2/ydhfBFXUi3elmYtxQC0gmA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://media.zenfs.com/es/holadoctor_741/446e91c67be00a8325791e0f36e38eda ",
        "stock": 9
      },
      {
        "nombre": "Aceite de Girasol Premium",

        "precio": 3.20,
        "descripcion": "Aceite de girasol refinado, perfecto para cocinar a alta temperatura.",
        "imagen": "https://somosgreenolive.com.ar/wp-content/uploads/2023/12/Aceite-de-Girasol-PURO-8-Lts_nueva.png",
        "stock": 2
      },
      {
        "nombre": "Aceite de Coco Virgen",

        "precio": 5.10,
        "descripcion": "Aceite de coco orgánico, ideal para cocinar y cuidado de la piel.",
        "imagen": "https://karayfoods.com/wp-content/uploads/2021/02/aceite-de-coco-001.jpg",
        "stock": 7
      },
      {
        "nombre": "Aceite de Canola Refinado",

        "precio": 2.90,
        "descripcion": "Aceite de canola ideal para frituras y productos horneados.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvI2vo_7u-awlLjQxBPT01QI686XVt2WWZxQ&s",
        "stock": 8
      },
      {
        "nombre": "Aceite de Aguacate Orgánico",

        "precio": 6.00,
        "descripcion": "Aceite de aguacate orgánico, rico en antioxidantes y grasas saludables.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg9GmXhOcL_jSzMwOtx5R5H6BxMQPh_XVWDg&s",
        "stock": 14
      },
      {
        "nombre": "Aceite de Sésamo Tostado",

        "precio": 3.50,
        "descripcion": "Aceite de sésamo tostado, ideal para salsas orientales.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWkxhxLY-_X9uB4m94i7HoSo5wALduPNVlIA&s",
        "stock": 12
      },
      {
        "nombre": "Aceite de Linaza",

        "precio": 4.10,
        "descripcion": "Aceite de linaza, conocido por sus propiedades antioxidantes.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSolUGGj1TDaKHNVxz0YWSfa4_l9yqdnGbpbQ&s",
        "stock": 22
      },
      {
        "nombre": "Aceite de Palma Ecológico",

        "precio": 2.50,
        "descripcion": "Aceite de palma orgánico, utilizado en la industria alimentaria.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbUu8CpBmhP6kWlk1EYvR95QBo8gmwofSAnA&s",
        "stock": 19
      },
      // bebidas 
      {
        "nombre": "Agua Mineral Natural",

        "precio": 1.20,
        "descripcion": "Agua mineral natural con minerales esenciales, ideal para hidratarte.",
        "imagen": "https://img.europapress.es/fotoweb/fotonoticia_20170823070938_1200.jpg",
        "stock": 12
      },
      {
        "nombre": "Jugo de Naranja 100% Natural",
        "precio": 1.80,
        "descripcion": "Jugo fresco de naranja exprimido sin conservantes ni aditivos.",
        "imagen": "https://www.supermaxi.com/wp-content/uploads/2024/08/items2Figm2F1000x10002F7862113111577-1-4.jpg",
        "stock": 17
      },
      {
        "nombre": "Refresco Cola Original",

        "precio": 1.50,
        "descripcion": "Refresco de cola clásico, refrescante y con sabor único.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0YImoMAl4lcov8rUNh23WLH7Mzwjo6DyTkw&s",
        "stock": 10
      },
      {
        "nombre": "Limonada Natural",
        "precio": 1.30,
        "descripcion": "Limonada natural, sin azúcares añadidos y refrescante.",
        "imagen": "https://cdn0.uncomo.com/es/posts/0/9/0/como_hacer_limonada_sin_azucar_51090_orig.jpg",
        "stock": 13
      },
      {
        "nombre": "Cerveza Artesanal IPA",

        "precio": 2.80,
        "descripcion": "Cerveza artesanal tipo IPA con sabor amargo y afrutado.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLcyXynIUNyRu40ZENzIXEV_xAdOPqws7FlA&s",
        "stock": 15
      },
      {
        "nombre": "Té Verde Natural",

        "precio": 2.20,
        "descripcion": "Té verde puro, ideal para mejorar la digestión.",
        "imagen": "https://www.comisariatonaturista.com/wp-content/uploads/2022/07/119725245_1459710284238397_891058432460524206_n.jpg",
        "stock": 12
      },
      {
        "nombre": "Jugo de Manzana Orgánico",

        "precio": 1.60,
        "descripcion": "Jugo orgánico de manzana, sin azúcares añadidos.",
        "imagen": "https://chedrauimx.vtexassets.com/arquivos/ids/35684173-800-auto?v=638615640135400000&width=800&height=auto&aspect=true",
        "stock": 16
      },
      {
        "nombre": "Agua Tónica Premium",

        "precio": 1.40,
        "descripcion": "Agua tónica de alta calidad, ideal para cócteles.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmLEAEfq6oisjU1igUqA661GY2TSNksU5lw&s",
        "stock": 14
      },

      // embutidos 
      {
        "nombre": "Jamón Ibérico",

        "precio": 6.50,
        "descripcion": "Jamón ibérico de bellota curado durante más de 36 meses.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrAtkeX0214muY7mPos8IrxZlHnMaoT3-1g&s",
        "stock": 29
      },
      {
        "nombre": "Chorizo Casero",

        "precio": 3.80,
        "descripcion": "Chorizo casero de cerdo, curado con pimentón y especias.",
        "imagen": "https://www.elespectador.com/resizer/v2/6KRXDJN4DFG47BJTFYFDWRU3NU.jpg?auth=1f6ad784767344adef6d24348a9324ec45c21db85333b145c54399b590c972ea&width=920&height=613&smart=true&quality=60",
        "stock": 27
      },
      {
        "nombre": "Salchichón Extra",

        "precio": 2.90,
        "descripcion": "Salchichón extra curado, con un sabor suave y tradicional.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThPCcsMoKOJNSrwOvkmvyfwc-y0UCKcNBv8A&s",
        "stock": 20
      },
      {
        "nombre": "Pavo Ahumado",

        "precio": 3.50,
        "descripcion": "Pavo ahumado, ideal para sandwiches y ensaladas.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFXzM-ZFyvzAlsAchKEDRGp_nqqUchNyaTyA&s",
        "stock": 24
      },
      {
        "nombre": "Mortadela de Bologna",

        "precio": 2.40,
        "descripcion": "Mortadela de Bologna con pistachos, suave y deliciosa.",
        "imagen": "https://www.supermaxi.com/wp-content/uploads/2024/12/7861042575191.png",
        "stock": 28
      },
      {
        "nombre": "Lomo Embuchado",

        "precio": 6.20,
        "descripcion": "Lomo embuchado curado, de sabor suave y ligeramente picante.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSKTHFfIHcP4HRSRa_0dQQo5htqfPGK2sauA&s",
        "stock": 30
      },
      {
        "nombre": "Longaniza Cular",

        "precio": 4.00,
        "descripcion": "Longaniza cular, con un sabor especiado y muy sabroso.",
        "imagen": "https://villadegraus.es/cdn/shop/files/Longaniza-Curada-Villa-de-Graus.jpg?v=1704971247&width=1200",
        "stock": 22
      },
      {
        "nombre": "Bacon Ahumado",

        "precio": 3.10,
        "descripcion": "Bacon ahumado, crujiente y con un sabor intenso.",
        "imagen": "https://www.gourmets.net/img/Productos/371814.jpg",
        "stock": 20
      },

      //congelados 
      {
        "nombre": "Pechuga de Pollo Congelada",

        "precio": 5.00,
        "descripcion": "Pechugas de pollo congeladas, de excelente calidad.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3qKNGHF2aOF-TDb7jJPdXYLKj-Feo0AE_Jw&s",
        "stock": 33
      },
      {
        "nombre": "Verduras Congeladas",

        "precio": 2.30,
        "descripcion": "Mezcla de verduras congeladas, ideal para sopas.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiieU4bzsxlzvU_--KrrIF__n2766LT0y7oA&s",
        "stock": 36
      },
      {
        "nombre": "Papas Fritas Congeladas",

        "precio": 1.90,
        "descripcion": "Papas fritas congeladas, listas para freír.",
        "imagen": "https://www.facundo.com.ec/wp-content/uploads/2020/11/papas-congeladas-rizada.png",
        "stock": 34
      },
      {
        "nombre": "Pizza Congelada Margarita",

        "precio": 4.50,
        "descripcion": "Pizza margarita congelada, fácil y deliciosa.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsH1YZj2vv1Vmh5ubJh-aF0bYbDC2I1lybwg&s",
        "stock": 36
      },
      {
        "nombre": "Helado de Fresa",

        "precio": 2.70,
        "descripcion": "Helado cremoso de fresa, refrescante y suave.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1vfSM--BveWB5TIXV-b_JwHxh9Tl9X1rcw&s",
        "stock": 32
      },
      {
        "nombre": "Mariscos Congelados",

        "precio": 6.00,
        "descripcion": "Mariscos congelados, ideales para guisos y sopas.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHaxG1Z850vXOa8yaDVmr-qintjsOkpUjBXA&s",
        "stock": 40
      },
      {
        "nombre": "Hamburguesas Congeladas",

        "precio": 4.20,
        "descripcion": "Hamburguesas congeladas de carne de res 100% natural.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6e769RT0Qqf6oJoDGwFuqkdmns646fba9g&s",
        "stock": 38
      },
      {
        "nombre": "Fresas Congeladas",

        "precio": 2.40,
        "descripcion": "Fresas congeladas, perfectas para batidos.",
        "imagen": "https://www.tasteboutique.com/cdn/shop/products/Fresascongeladaslahuerta500gr_600x.jpg?v=1595377487",
        "stock": 30
      }
    ];
    let contar = 0;
    let j = 0;
    for (let i = 0; i < products.length; i++) {
      if (contar == 8) {
        j++;
      }
      contar++;
      const c = categoriesDB[j];
      const product = new Product({
        name: products[i].nombre,
        category: c._id,
        description: products[i].descripcion,
        price: products[i].precio,
        stock: products[i].stock,
        image: products[i].imagen,
        tags: products[i].tags,
      });
      await product.save();
    }
    console.log("Productos creados.");
  } catch (error) {
    console.error("Error poblando la base de datos:", error);
  } finally {
    mongoose.connection.close(); // Cierra la conexión al terminar
  }
};

// Ejecutar el script
const run = async () => {
  await connectDB();
  await populateDatabase();
};

run();