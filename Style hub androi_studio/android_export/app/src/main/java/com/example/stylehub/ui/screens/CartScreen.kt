package com.example.stylehub.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.collectAsState
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
import com.example.stylehub.data.model.CartItemUi
import com.example.stylehub.ui.viewmodel.CartUiState
import com.example.stylehub.ui.viewmodel.ProductViewModel
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    viewModel: ProductViewModel,
    onContinueShopping: () -> Unit,
    modifier: Modifier = Modifier
) {
    val cartState by viewModel.cartState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Mi carrito", fontWeight = FontWeight.Bold)
                        AnimatedContent(
                            targetState = cartState.totalItems,
                            label = "cartCount"
                        ) { count ->
                            Text(
                                text = if (count == 1) "1 artículo seleccionado" else "$count artículos seleccionados",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                },
                actions = {
                    if (cartState.items.isNotEmpty()) {
                        IconButton(onClick = viewModel::clearCart) {
                            Icon(Icons.Default.DeleteOutline, contentDescription = "Vaciar carrito")
                        }
                    }
                }
            )
        },
        bottomBar = {
            AnimatedVisibility(
                visible = cartState.items.isNotEmpty(),
                enter = slideInVertically(animationSpec = tween(280)) { it } + fadeIn(),
                exit = fadeOut()
            ) {
                CheckoutSummary(cartState = cartState, onCheckout = viewModel::checkout)
            }
        }
    ) { paddingValues ->
        if (cartState.items.isEmpty()) {
            EmptyCart(
                onContinueShopping = onContinueShopping,
                modifier = modifier.padding(paddingValues)
            )
        } else {
            LazyColumn(
                modifier = modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    start = 16.dp, top = 12.dp, end = 16.dp, bottom = 18.dp
                ),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(cartState.items, key = { it.product.id }) { item ->
                    CartItemCard(
                        item = item,
                        onIncrease = { viewModel.updateCartQuantity(item.product.id, item.quantity + 1) },
                        onDecrease = { viewModel.updateCartQuantity(item.product.id, item.quantity - 1) },
                        onRemove = { viewModel.removeFromCart(item.product.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun CartItemCard(
    item: CartItemUi,
    onIncrease: () -> Unit,
    onDecrease: () -> Unit,
    onRemove: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(88.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color.White),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = item.product.image,
                    contentDescription = item.product.title,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize().padding(8.dp)
                )
            }
            Spacer(Modifier.size(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.product.title,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp
                )
                Spacer(Modifier.height(6.dp))
                Text(
                    text = item.product.price.money(),
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp
                )
                Spacer(Modifier.height(10.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.secondaryContainer
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(onClick = onDecrease, modifier = Modifier.size(34.dp)) {
                                Icon(Icons.Default.Remove, contentDescription = "Reducir cantidad", modifier = Modifier.size(17.dp))
                            }
                            Text(item.quantity.toString(), fontWeight = FontWeight.Bold)
                            IconButton(onClick = onIncrease, modifier = Modifier.size(34.dp)) {
                                Icon(Icons.Default.Add, contentDescription = "Aumentar cantidad", modifier = Modifier.size(17.dp))
                            }
                        }
                    }
                    Spacer(Modifier.weight(1f))
                    IconButton(onClick = onRemove) {
                        Icon(
                            Icons.Default.DeleteOutline,
                            contentDescription = "Eliminar producto",
                            tint = MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CheckoutSummary(cartState: CartUiState, onCheckout: () -> Unit) {
    Surface(shadowElevation = 12.dp, tonalElevation = 3.dp) {
        Column(modifier = Modifier.padding(20.dp)) {
            PriceRow("Subtotal", cartState.subtotal.money())
            Spacer(Modifier.height(6.dp))
            PriceRow("Impuestos estimados", cartState.tax.money())
            Spacer(Modifier.height(12.dp))
            HorizontalDivider()
            Spacer(Modifier.height(12.dp))
            PriceRow("Total", cartState.total.money(), emphasized = true)
            Spacer(Modifier.height(16.dp))
            Button(
                onClick = onCheckout,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.ShoppingBag, contentDescription = null)
                Spacer(Modifier.size(8.dp))
                Text("Confirmar pedido", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun PriceRow(label: String, value: String, emphasized: Boolean = false) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, fontWeight = if (emphasized) FontWeight.Bold else FontWeight.Normal)
        Text(value, fontWeight = if (emphasized) FontWeight.Black else FontWeight.SemiBold)
    }
}

@Composable
private fun EmptyCart(onContinueShopping: () -> Unit, modifier: Modifier = Modifier) {
    Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Surface(
                shape = RoundedCornerShape(28.dp),
                color = MaterialTheme.colorScheme.secondaryContainer,
                modifier = Modifier.size(104.dp)
            ) {
                Icon(
                    Icons.Outlined.ShoppingCart,
                    contentDescription = null,
                    modifier = Modifier.padding(28.dp),
                    tint = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }
            Spacer(Modifier.height(20.dp))
            Text("Tu carrito está vacío", fontWeight = FontWeight.Black, fontSize = 21.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                "Explora productos seleccionados para ti y añádelos cuando quieras.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(20.dp))
            ElevatedButton(onClick = onContinueShopping, shape = RoundedCornerShape(14.dp)) {
                Text("Explorar catálogo")
            }
        }
    }
}

private fun Double.money(): String = String.format(Locale.US, "$%.2f", this)
