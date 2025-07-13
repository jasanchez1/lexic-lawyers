<template>
  <select
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="['form-input', className]"
    :required="required"
  >
    <option value="">{{ placeholder }}</option>
    
    <optgroup 
      v-for="region in citiesByRegion" 
      :key="region.name"
      :label="region.name"
    >
      <option 
        v-for="city in region.cities" 
        :key="city"
        :value="city"
      >
        {{ city }}
      </option>
    </optgroup>
  </select>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    default: 'city'
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecciona tu ciudad'
  },
  required: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const citiesByRegion = [
  {
    name: "Región Metropolitana",
    cities: ["Santiago", "Las Condes", "Providencia", "Ñuñoa", "Maipú", 
             "La Florida", "Puente Alto", "San Bernardo", "Melipilla", "Talagante"]
  },
  {
    name: "Región de Valparaíso",
    cities: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", 
             "San Antonio", "Quillota", "Los Andes", "San Felipe"]
  },
  {
    name: "Región del Biobío",
    cities: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", 
             "Coronel", "San Pedro de la Paz", "Hualpén"]
  },
  {
    name: "Región de La Araucanía",
    cities: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"]
  },
  {
    name: "Región de Los Lagos",
    cities: ["Puerto Montt", "Osorno", "Valdivia", "Castro", 
             "Puerto Varas", "Ancud"]
  },
  {
    name: "Región de Antofagasta",
    cities: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"]
  },
  {
    name: "Región de Atacama",
    cities: ["Copiapó", "Caldera", "Vallenar", "Chañaral"]
  },
  {
    name: "Región de Coquimbo",
    cities: ["La Serena", "Coquimbo", "Ovalle", "Illapel"]
  },
  {
    name: "Región del Maule",
    cities: ["Talca", "Curicó", "Rancagua", "Linares", "Molina"]
  },
  {
    name: "Región de Tarapacá",
    cities: ["Iquique", "Alto Hospicio", "Pozo Almonte"]
  },
  {
    name: "Región de Arica y Parinacota",
    cities: ["Arica", "Putre"]
  },
  {
    name: "Región de Magallanes",
    cities: ["Punta Arenas", "Puerto Natales", "Porvenir"]
  },
  {
    name: "Región de Aysén",
    cities: ["Coyhaique", "Puerto Aysén", "Chile Chico"]
  }
]
</script>