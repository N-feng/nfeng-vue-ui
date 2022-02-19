import type { Ref } from 'vue'

export function getExpose<T extends readonly string[]>(
  methods: T,
  compRef: Ref<any>
): { [key in T[number]]: (...args: any) => void }
export function getExpose(methods = [], compRef) {
  if (!Array.isArray(methods)) {
    console.error('function getExpose [methods] should be string[]')
  }
  return methods.reduce(
    (obj, name) => ({
      ...obj,
      [name]: (...args) => compRef.value[name] && compRef.value[name](...args),
    }),
    {}
  )
}