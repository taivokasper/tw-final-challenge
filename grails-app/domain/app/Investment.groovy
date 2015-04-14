package app

class Investment {

    static constraints = {
        username blank: false
    }

    String username
    Date investedDate = new Date()
    BigDecimal amount = BigDecimal.ZERO
}
