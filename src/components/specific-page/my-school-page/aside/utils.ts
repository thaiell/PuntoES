export const schoolAsideId = "school-aside"
export const schooButtonAsideId = "school-aside-button"
export const schoolCloseButtonAsideId = "school-aside-button-close"

export const handleSchoolAsideView = ( aside: HTMLElement | null ) => {
    aside?.classList.toggle("translate-x-full")
}
