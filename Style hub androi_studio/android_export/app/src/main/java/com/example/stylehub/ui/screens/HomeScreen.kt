package com.example.stylehub.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Login
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.stylehub.data.model.Product
import com.example.stylehub.ui.viewmodel.ProductViewModel

/**
 * 4. Pantalla 1: Home (Catálogo) en Jetpack Compose
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: ProductViewModel,
    onProductClick: (Product) -> Unit,
    onCartClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val catalogState by viewModel.catalogState.collectAsState()
    val cartState by viewModel.cartState.collectAsState()
    val authState by viewModel.authState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Style",
                            fontWeight = FontWeight.Black,
                            fontSize = 20.sp
                        )
                        Text(
                            text = "Hub",
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Black,
                            fontSize = 20.sp
                        )
                    }
                },
                actions = {
                    // Botón de Usuario / Login
                    IconButton(onClick = { viewModel.setAuthModalOpen(true) }) {
                        Icon(
                            imageVector = if (authState.isAuthenticated) Icons.Default.AccountCircle else Icons.AutoMirrored.Filled.Login,
                            contentDescription = "Cuenta"
                        )
                    }
                    // Botón de Carrito con Badge
                    BadgedBox(
                        badge = {
                            if (cartState.totalItems > 0) {
                                Badge { Text("${cartState.totalItems}") }
                            }
                        },
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        IconButton(onClick = onCartClick) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = "Carrito")
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("TU ESTILO, A TU MANERA", style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onPrimaryContainer, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(6.dp))
                        Text("Encuentra tu próximo favorito", style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.onPrimaryContainer, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(4.dp))
                        Text("Explora piezas seleccionadas para ti", style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.78f))
                    }
                    Icon(Icons.Default.Checkroom, contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(38.dp))
                }
            }

            // Barra de Búsqueda
            OutlinedTextField(
                value = catalogState.searchQuery,
                onValueChange = { viewModel.searchProducts(it) },
                placeholder = { Text("Buscar en el catálogo...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Chips de Categorías
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = catalogState.selectedCategory == "all",
                        onClick = { viewModel.selectCategory("all") },
                        label = { Text("Todos") }
                    )
                }
                items(catalogState.categories) { category ->
                    FilterChip(
                        selected = catalogState.selectedCategory == category,
                        onClick = { viewModel.selectCategory(category) },
                        label = { Text(category.replaceFirstChar { it.uppercase() }) }
                    )
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Catálogo", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text("${catalogState.products.size} productos", style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            // Grid de Productos
            if (catalogState.isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else if (catalogState.products.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxWidth().weight(1f).padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(Icons.Default.SearchOff, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(44.dp))
                    Spacer(Modifier.height(12.dp))
                    Text("No encontramos productos", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Text("Prueba otra búsqueda o categoría.", style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant)
                    TextButton(onClick = { viewModel.searchProducts(""); viewModel.selectCategory("all") }) {
                        Text("Ver todo el catálogo")
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(catalogState.products, key = { it.id }) { product ->
                        ProductCard(
                            product = product,
                            onCardClick = { onProductClick(product) },
                            onAddToCart = { viewModel.addToCart(product, 1) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ProductCard(
    product: Product,
    onCardClick: () -> Unit,
    onAddToCart: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp, pressedElevation = 4.dp),
        modifier = modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Imagen del producto con Coil
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = product.image,
                    contentDescription = product.title,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize().padding(12.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Rating
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = Color(0xFFFFB800),
                    modifier = Modifier.size(16.dp)
                )
                Text(
                    text = "${product.rating?.rate ?: 4.5}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(start = 4.dp)
                )
                Text(
                    text = "(${product.rating?.count ?: 0})",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(start = 2.dp)
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Título
            Text(
                text = product.title,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Precio y Botón Añadir
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "$${String.format("%.2f", product.price)}",
                    fontWeight = FontWeight.Black,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.primary
                )

                IconButton(
                    onClick = onAddToCart,
                    modifier = Modifier
                        .size(36.dp)
                        .background(MaterialTheme.colorScheme.primary, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Añadir",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}
