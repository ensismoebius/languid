#include <gtest/gtest.h>

class ContaBancaria
{
public:
    int saldo;
    void depositar(int valor) { saldo += valor; }
    void sacar(int valor)
    {
        if (saldo - valor >= 0)
            saldo -= valor;
    }
};

TEST(ContaBancariaTest, DepositoSaque)
{
    ContaBancaria c;
    c.saldo = 100;
    c.depositar(50);
    c.sacar(30);
    EXPECT_EQ(c.saldo, 120);
}
