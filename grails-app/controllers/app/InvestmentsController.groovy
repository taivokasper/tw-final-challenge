package app

import app.auth.User
import grails.converters.JSON

class InvestmentsController {

    def index() {
        BigInteger sum = BigInteger.ZERO
        def userInvestments = Investment.findAllByUserAndInvestedDateLessThanEquals(
                User.findById(params.long("id")).username, new Date())
        userInvestments.each {investment ->
            sum = investment.amount.add(sum)
        }
        def investments = new UserInvestments()
        investments.setSum(sum)
        render investments as JSON
    }

    def create() {
        Investment investment = new Investment(params)
        investment.save(flush: true, failOnError: true)
        render investment as JSON
    }
}
