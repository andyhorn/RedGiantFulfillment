<template>
    <div class="container">
        <h1>Error 403 - Unauthorized</h1>
        <p>You do not have permission to access this resource. If you think this is mistaken, please speak with the site administrator.</p>
        <p>Otherwise, <router-link to="/login">Login</router-link> and try again.</p>
    </div>    
</template>

<script>
export default {
    name: 'error_403'
}
</script>

<style scoped>

</style>