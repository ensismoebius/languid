#include <gtest/gtest.h>

class ContaCorrente
{
    int saldo, limite;

public:
    ContaCorrente(int s, int l) : saldo(s), limite(l) {}
    bool sacar(int valor)
    {
        if (saldo - valor < -limite)
            return false;
        saldo -= valor;
        return true;
    }
    int getSaldo() const { return saldo; }
};

TEST(ContaCorrenteTest, SaqueComLimite)
{
    ContaCorrente c(100, 50);
    EXPECT_TRUE(c.sacar(120));
    EXPECT_EQ(c.getSaldo(), -20);
    EXPECT_FALSE(c.sacar(31)); // Não pode passar do limite
}
