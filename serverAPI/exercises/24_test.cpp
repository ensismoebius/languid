#include <gtest/gtest.h>

class Vetor
{
    int *dados;
    int tamanho;

public:
    Vetor(int n) : tamanho(n) { dados = new int[n]; }
    ~Vetor() { delete[] dados; }
    void set(int i, int v) { dados[i] = v; }
    int get(int i) const { return dados[i]; }
    int size() const { return tamanho; }
};

TEST(VetorTest, VetorDinamico)
{
    Vetor v(3);
    v.set(0, 1);
    v.set(1, 2);
    v.set(2, 3);
    EXPECT_EQ(v.get(0), 1);
    EXPECT_EQ(v.get(1), 2);
    EXPECT_EQ(v.get(2), 3);
    EXPECT_EQ(v.size(), 3);
}
