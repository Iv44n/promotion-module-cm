package com.example.moduloventa.viewmodel


import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.example.moduloventa.model.PromoModel

class PromoViewModel : ViewModel() {

    var promos = mutableStateOf<List<PromoModel>>(emptyList())
        private set

    fun cargarPromos() {
        promos.value = listOf(
            PromoModel(1, "Promo 2x1", "50%"),
            PromoModel(2, "Descuento verano", "30%")
        )
    }

    fun agregarPromo(promo: PromoModel) {
        promos.value = promos.value + promo
    }
}