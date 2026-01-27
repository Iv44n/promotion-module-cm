package com.example.moduloventa.view.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.LocalOffer
import androidx.compose.material.icons.outlined.SearchOff
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun PromoEmptyState(
    onAddPromoClick: () -> Unit = {}
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
//            .background(MaterialTheme.colorScheme.background)
            .background(MaterialTheme.colorScheme.background)

    ) {

        // CONTENIDO CENTRAL
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 32.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Box(
                modifier = Modifier.size(220.dp),
                contentAlignment = Alignment.Center
            ) {

                // Halo difuminado
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .background(
//                            MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                            Color(0xFFE1F2F2),
                            CircleShape
                        )
                        .blur(40.dp)
                )

                Column(horizontalAlignment = Alignment.CenterHorizontally) {

                    Box(
                        modifier = Modifier
                            .size(140.dp)
                            .background(
//                                MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                                Color(0xFF81E0DC),
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.LocalOffer,
                            contentDescription = null,
//                            tint = MaterialTheme.colorScheme.primary,
                            tint = Color(0xFF29A7A4),
                            modifier = Modifier.size(80.dp),
                        )
                    }

                    Box(
                        modifier = Modifier
                            .offset(x = 45.dp, y = (-115).dp)
                            .size(44.dp)
                            .shadow(6.dp, CircleShape)
//                            .background(MaterialTheme.colorScheme.surface, CircleShape),
                            .background(Color(0xFF29A7A4)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.SearchOff,
                            contentDescription = null,
//                            tint = MaterialTheme.colorScheme.primary
                            tint = Color(0xFF31FFFA)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "No hay promociones",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "No tiene nuevas promociones, cree una para atraer más clientes a su bodega.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }

        // BOTÓN FLOTANTE
        Button(
            onClick = onAddPromoClick,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 24.dp, bottom = 32.dp)
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF29A7A4)
            ),
            shape = RoundedCornerShape(28.dp)
            //            containerColor = MaterialTheme.colorScheme.primary
//            containerColor = Color(0xFF29A7A4),
        ) {
            Text(
                text = "➕ Nuevo",
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PromoEmptyStatePreview() {
    MaterialTheme {
        PromoEmptyState()
    }
}
