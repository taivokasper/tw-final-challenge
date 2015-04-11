package app

class Investment {

    static constraints = {
        user blank: false
    }

    String user
    Date investedDate = new Date()
    BigDecimal amount = BigDecimal.ZERO
}
