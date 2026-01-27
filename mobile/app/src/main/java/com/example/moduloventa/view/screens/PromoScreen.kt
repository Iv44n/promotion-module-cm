package com.example.moduloventa.view.screens

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.moduloventa.view.components.PromoEmptyState
import com.example.moduloventa.viewmodel.PromoViewModel


@Composable
fun PromoScreem(
    onAddPromoClick: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: PromoViewModel = viewModel()
) {
    val promos = viewModel.promos.value

    if (promos.isEmpty()) {
        PromoEmptyState(
            onAddPromoClick = onAddPromoClick
        )
    } else {
        // PromoList(...)
    }
}