# 🤖 PROMPTS PARA EL AGENTE DE ANDROID STUDIO (Gemini / Copilot / Cursor)

Este archivo contiene los **Prompts Maestros** diseñados para que el Asistente/Agente IA dentro de **Android Studio** configure, compile y ejecute la aplicación nativa **StyleHub** sin errores.

---

## 📌 PROMPT 1: Creación y Configuración del Proyecto Base

Copia y pega este prompt en el chat del agente de Android Studio:

```text
Actúa como un Desarrollador Android Senior experto en Kotlin y Jetpack Compose.
Quiero que revises y configures el proyecto "StyleHub" en este espacio de trabajo:

1. El proyecto es una aplicación nativa Android bajo el patrón MVVM y Jetpack Compose que consume la Fake Store API (https://fakestoreapi.com).
2. Verifica que el archivo `app/build.gradle.kts` tenga configuradas las dependencias para:
   - Retrofit 2.9.0 + Gson Converter
   - OkHttp 4.12.0 con Logging Interceptor
   - Jetpack Compose Material 3 (BOM 2024.02.00)
   - Coil Compose 2.5.0 (io.coil-kt:coil-compose)
   - Navigation Compose 2.7.7
   - Lifecycle ViewModel Compose 2.7.0
   - Coroutines Android 1.7.3
3. Asegúrate de que `AndroidManifest.xml` incluya el permiso:
   <uses-permission android:name="android.permission.INTERNET" />
4. Sincroniza Gradle (Sync Project with Gradle Files).
```

---

## 📌 PROMPT 2: Validación de la Arquitectura MVVM y Modelos de Datos

```text
Actúa como Arquitecto de Software Android.
Revisa los archivos en el paquete `com.example.stylehub`:

1. `data/model/Models.kt`:
   - Verifica las Data Classes: Product, Rating, User, UserName, UserAddress, Geolocation, Cart, CartItem y CartItemUi.
   - Deben coincidir exactamente con los endpoints JSON de https://fakestoreapi.com.

2. `data/network/ProductApiService.kt`:
   - Interfaz Retrofit con los endpoints:
     * GET("products") -> List<Product>
     * GET("products/{id}") -> Product
     * GET("products/categories") -> List<String>
     * GET("users") -> List<User>
     * GET("carts/user/{userId}") -> List<Cart>
   - Cliente singleton RetrofitClient con base URL "https://fakestoreapi.com/".

3. `data/repository/ProductRepository.kt`:
   - Métodos suspendidos ejecutados en Dispatchers.IO.
   - Manejo de Fallback offline con datos locales preconfigurados para evitar que la app crashee si el emulador no tiene conexión a internet.
```

---

## 📌 PROMPT 3: ViewModel Reactivo con StateFlow y Smart Fallback

```text
Revisa `ui/viewmodel/ProductViewModel.kt`:
1. Debe heredar de ViewModel() y exponer tres StateFlow inmutables:
   - `catalogState: StateFlow<CatalogUiState>` (productos, categorías, búsqueda, estado de carga)
   - `cartState: StateFlow<CartUiState>` (items, totalItems, subtotal, impuestos, total)
   - `authState: StateFlow<AuthUiState>` (currentUser, availableUsers, isAuthenticated, userCarts, toastMessage)

2. Reactividad del Carrito:
   - `addToCart(product, quantity)` debe actualizar inmediatamente los contadores y subtotales.
   - `updateCartQuantity(productId, quantity)` y `removeFromCart(productId)` deben calcular los nuevos totales de forma síncrona.

3. Sistema de Login con Smart Fallback (Bypass de Acceso):
   - `login(userId: Int)` debe cambiar al usuario seleccionado y cargar inmediatamente sus carritos con `loadUserCarts(userId)`.
   - `loginWithCredentials(username, password)` debe buscar coincidencias en los perfiles de la Fake Store API. Si no existe o las credenciales fallan, debe ejecutar el Bypass Inteligente asignando por defecto a John Doe (#1) para garantizar que la presentación NUNCA se bloquee.
```

---

## 📌 PROMPT 4: Pantallas Jetpack Compose y Navegación

```text
Verifica la capa de interfaz en Compose:
1. `HomeScreen.kt`:
   - TopAppBar con branding StyleHub, botón de Cuenta y badge reactivo de Carrito.
   - Buscador en tiempo real y chips de categorías.
   - LazyVerticalGrid de 2 columnas con imágenes cargadas vía Coil `AsyncImage`.
   - Botón directo para añadir al carrito con feedback visual.

2. `ProductDetailScreen.kt`:
   - Imagen grande del producto en alta resolución.
   - Rating, descripción completa, selector interactivo de cantidad (+ / -).
   - Botón "Añadir al Carrito" que conecta con el ViewModel.

3. `UserProfileScreen.kt`:
   - Tarjeta de usuario con iniciales, datos de contacto y dirección.
   - Selector rápido para alternar entre los usuarios oficiales de la Fake Store API.
   - Historial de pedidos recuperados desde `GET /carts/user/{id}`.

4. `AuthModal.kt`:
   - ModalBottomSheet con 2 pestañas:
     * Pestaña 1: Acceso rápido con 1 clic con los perfiles reales (John, David, Kevin, Don, Derek).
     * Pestaña 2: Formulario de credenciales con Smart Fallback.
     * Botón de Bypass Inmediato "Demo (John Doe)".

5. `MainActivity.kt`:
   - Scaffold con NavigationBar inferior ("Catálogo" y "Perfil").
   - NavHost con rutas "home", "detail/{productId}" y "profile".
   - Renderizado del AuthBottomSheet cuando `authState.isAuthModalOpen == true`.
```

---

## 📌 PROMPT 5: Compilación y Ejecución en el Emulador

```text
Ejecuta la tarea Gradle assembleDebug o corre la app en el emulador:
1. Asegúrate de que no haya errores de importación en ningún archivo.
2. Si aparece algún warning sobre deprecated en Compose, usa las recomendaciones de Material 3.
3. Inicia la aplicación en el emulador Android (API 24+) y valida:
   - Que cargue el catálogo de productos desde Fake Store API.
   - Que al pulsar en "Cuenta" se abra el modal de login y permita entrar con 1 clic.
   - Que al añadir productos al carrito el contador superior se actualice de inmediato.
   - Que al navegar a "Perfil" se muestren los datos del usuario activo y su historial de carritos.
```
